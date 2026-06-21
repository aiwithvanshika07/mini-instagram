function likePost(button) {
  if (button.innerText.includes("♡")) {
    button.innerText = "❤️ Liked";
    button.style.color = "#ff006a";
  } else {
    button.innerText = "♡ Like";
    button.style.color = "white";
  }
}
