package expo.modules.chaosnative

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream
import java.security.MessageDigest
import kotlin.math.pow

class ChaosNativeModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ChaosNative")

        AsyncFunction("scrambleImage") { base64Image: String, password: String ->
            try {
                val bitmap = base64ToBitmap(base64Image)
                val (x0, r, y0, d) = deriveKeysFromPassword(password)
                val encryptedBitmap = encryptImage(bitmap, x0, r, y0, d)
                bitmapToBase64(encryptedBitmap)
            } catch (e: Exception) {
                throw Exception("Scramble failed: ${e.message}")
            }
        }

        AsyncFunction("unscrambleImage") { base64Image: String, password: String ->
            try {
                val bitmap = base64ToBitmap(base64Image)
                val (x0, r, y0, d) = deriveKeysFromPassword(password)
                val decryptedBitmap = decryptImage(bitmap, x0, r, y0, d)
                bitmapToBase64(decryptedBitmap)
            } catch (e: Exception) {
                throw Exception("Unscramble failed: ${e.message}")
            }
        }
    }

    private fun base64ToBitmap(base64: String): Bitmap {
        val cleanBase64 = base64.replace("data:image/png;base64,", "")
            .replace("data:image/jpeg;base64,", "")
            .replace("data:image/jpg;base64,", "")
        val decodedBytes = Base64.decode(cleanBase64, Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
    }

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        val bytes = outputStream.toByteArray()
        return Base64.encodeToString(bytes, Base64.NO_WRAP)
    }

    private fun deriveKeysFromPassword(password: String): List<Double> {
        val hash = MessageDigest.getInstance("SHA-256").digest(password.toByteArray())
        
        val x0 = bytesToDouble(hash, 0) % 1.0
        val r = 3.57 + (bytesToDouble(hash, 8) % 0.43) 
        val y0 = bytesToDouble(hash, 16) % 1.0
        val d = 3.57 + (bytesToDouble(hash, 24) % 0.43)
        
        return listOf(
            if (x0 == 0.0) 0.1 else x0,
            r,
            if (y0 == 0.0) 0.1 else y0,
            d
        )
    }

    // Konwersja bajtów na double
    private fun bytesToDouble(bytes: ByteArray, offset: Int): Double {
        var value = 0.0
        for (i in 0 until 8) {
            if (offset + i < bytes.size) {
                value += (bytes[offset + i].toInt() and 0xFF) / 256.0.pow(i + 1)
            }
        }
        return value
    }

    private fun logisticMap(x: Double, r: Double): Double {
        var result = r * x * (1.0 - x)
        if (result <= 0.0) result = 0.000001
        if (result >= 1.0) result = 0.999999
        return result
    }

    private fun generateLogisticSequence(x0: Double, r: Double, length: Int): DoubleArray {
        val sequence = DoubleArray(length)
        var x = x0
        for (i in 0 until length) {
            x = logisticMap(x, r)
            sequence[i] = x
        }
        return sequence
    }

    private fun createPermutation(sequence: DoubleArray): IntArray {
        val indexed = sequence.mapIndexed { index, value -> index to value }
        val sorted = indexed.sortedBy { it.second }
        return sorted.map { it.first }.toIntArray()
    }

    private fun logisticValueToByte(value: Double, q: Int = 10): Int {
        val fractional = value - value.toInt()
        val fractionalStr = fractional.toString().removePrefix("0.")
        
        val digits = fractionalStr.trimStart('0').take(q)
        
        return if (digits.isNotEmpty()) {
            digits.toLongOrNull()?.rem(256)?.toInt() ?: 0
        } else {
            0
        }
    }

    private fun encryptImage(bitmap: Bitmap, x0: Double, r: Double, y0: Double, d: Double): Bitmap {
        val width = bitmap.width
        val height = bitmap.height
        val totalPixels = width * height
        
        val pixels = IntArray(totalPixels)
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height)
        
        val permSequence = generateLogisticSequence(x0, r, totalPixels)
        val permutation = createPermutation(permSequence)
        val permutedPixels = IntArray(totalPixels)
        for (i in 0 until totalPixels) {
            permutedPixels[i] = pixels[permutation[i]]
        }
        
        val substSequence = generateLogisticSequence(y0, d, totalPixels * 4)
        val encryptedPixels = IntArray(totalPixels)
        
        for (i in 0 until totalPixels) {
            val pixel = permutedPixels[i]
            
            val a = (pixel shr 24) and 0xFF
            val r = (pixel shr 16) and 0xFF
            val g = (pixel shr 8) and 0xFF
            val b = pixel and 0xFF
            
            val keyA = logisticValueToByte(substSequence[i * 4])
            val keyR = logisticValueToByte(substSequence[i * 4 + 1])
            val keyG = logisticValueToByte(substSequence[i * 4 + 2])
            val keyB = logisticValueToByte(substSequence[i * 4 + 3])
            
            val encA = a xor keyA
            val encR = r xor keyR
            val encG = g xor keyG
            val encB = b xor keyB
            
            encryptedPixels[i] = (encA shl 24) or (encR shl 16) or (encG shl 8) or encB
        }
        
        val result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        result.setPixels(encryptedPixels, 0, width, 0, 0, width, height)
        return result
    }

    private fun decryptImage(bitmap: Bitmap, x0: Double, r: Double, y0: Double, d: Double): Bitmap {
        val width = bitmap.width
        val height = bitmap.height
        val totalPixels = width * height
        
        val pixels = IntArray(totalPixels)
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height)
        
        val substSequence = generateLogisticSequence(y0, d, totalPixels * 4)
        val unsubstitutedPixels = IntArray(totalPixels)
        
        for (i in 0 until totalPixels) {
            val pixel = pixels[i]
            
            val a = (pixel shr 24) and 0xFF
            val r = (pixel shr 16) and 0xFF
            val g = (pixel shr 8) and 0xFF
            val b = pixel and 0xFF
            
            val keyA = logisticValueToByte(substSequence[i * 4])
            val keyR = logisticValueToByte(substSequence[i * 4 + 1])
            val keyG = logisticValueToByte(substSequence[i * 4 + 2])
            val keyB = logisticValueToByte(substSequence[i * 4 + 3])
            
            val decA = a xor keyA
            val decR = r xor keyR
            val decG = g xor keyG
            val decB = b xor keyB
            
            unsubstitutedPixels[i] = (decA shl 24) or (decR shl 16) or (decG shl 8) or decB
        }
        
        val permSequence = generateLogisticSequence(x0, r, totalPixels)
        val permutation = createPermutation(permSequence)
        val decryptedPixels = IntArray(totalPixels)
        
        for (i in 0 until totalPixels) {
            decryptedPixels[permutation[i]] = unsubstitutedPixels[i]
        }
        
        val result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        result.setPixels(decryptedPixels, 0, width, 0, 0, width, height)
        return result
    }
}