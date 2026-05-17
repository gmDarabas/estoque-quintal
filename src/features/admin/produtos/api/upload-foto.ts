import { supabase } from "@/supabaseClient";
import { Buckets } from "@/types/interfaces";

const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.8;

function normalizeFileName(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;

  const normalized = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();

  return `${normalized}_${Date.now()}.jpg`;
}

function comprimirImagem(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao comprimir imagem'))),
        'image/jpeg',
        JPEG_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Falha ao carregar imagem'));
    };

    img.src = objectUrl;
  });
}

export const uploadFotoProduto = async (produtoId: string, file: File): Promise<string> => {
  const blob = await comprimirImagem(file);
  const fileName = normalizeFileName(file.name);
  const filePath = `${produtoId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(Buckets.fotosProduto)
    .upload(filePath, blob, { contentType: 'image/jpeg' });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(Buckets.fotosProduto)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};
