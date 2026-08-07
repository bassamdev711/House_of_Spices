import { put } from '@vercel/blob'

export async function uploadImage(file: File, folder = 'products'): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  
  const { url } = await put(filename, file, {
    access: 'public',
  })
  
  return url
}
