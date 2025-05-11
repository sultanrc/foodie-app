import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";

import sql from "better-sqlite3";
const db = sql("meals.db");

export function getMeals() {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  //   throw new Error("Error fetching meals");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // •	Gambar dikirim dari browser = paket dalam bentuk potongan-potongan byte.
  // •	arrayBuffer() = buka semua potongan jadi satu buffer.
  // •	Buffer.from(...) = ubah jadi format Node.js bisa tulis.
  // •	fs.createWriteStream(...) = buka pintu ke folder images.
  // •	stream.write(...) = lempar data potongan demi potongan ke folder images.
  // •	Terakhir, kita kasih tahu URL-nya buat dipanggil di halaman nanti.

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`./public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();
  // gambar kita terima dengan bentuk array buffer, arraynya berisi potongan-potongan byte seperti angka dan huruf random.

  stream.write(Buffer.from(bufferedImage), (err) => {
    if (err) {
      throw new Error("Error writing file:");
    }
  });

  meal.image = `/images/${fileName}`; //gapake public karena emg public gaperlu ditulis
  //kalo dipanggil pake {} juga enak, lgsg ke direktorinya.
  // misal src={/images/slug.jpg} gitu.

  db.prepare(
    `
    INSERT INTO meals (
      title,
      summary,
      instructions,
      creator,
      creator_email,
      image,
      slug
    ) VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `
  ).run(meal);
}
