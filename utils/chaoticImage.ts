export async function scrambleImageBase64(base64: string, password: string): Promise<string> {
  return processImageBase64(base64, password);
}

export async function unscrambleImageBase64(base64: string, password: string): Promise<string> {
  return processImageBase64(base64, password);
}

async function processImageBase64(base64: string, password: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    return base64;
  });
}
