// functions/r.js
export async function onRequestGet() {
  return new Response(
    `<!DOCTYPE html>
<script>
  window.location.href = 'https://youtu.be/dQw4w9WgXcQ';
</script>`,
    {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    }
  );
}
