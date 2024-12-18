function toggleContent() {
    var moreText = document.querySelector('.more-text');
    var btn = document.querySelector('.read-more-btn');
  
    if (moreText.style.display === "none" || moreText.style.display === "") {
      moreText.style.display = "block";
      btn.textContent = "Read less";
    } else {
      moreText.style.display = "none";
      btn.textContent = "Read more";
    }
  }