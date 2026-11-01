async function test() {
  const pinUrl = "https://www.pinterest.com/pin/1089308472398572111/";
  const res = await fetch(pinUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    }
  });
  const text = await res.text();
  const allImages = [...new Set(text.match(/https:\/\/i\.pinimg\.com\/[^\s"<>'\\)]+/g) || [])];
  console.log("Images found:", allImages.length);
  if (allImages.length > 0) {
    console.log("First 3:", allImages.slice(0, 3));
  }
  const allVideos = [...new Set(text.match(/https:\/\/[^\s"<>'\\)]+\.(mp4|m3u8)/g) || [])];
  console.log("Videos found:", allVideos);
}
test();
