// 타이핑 효과
function typeText(content) {
  const text = document.querySelector("#typing");
  let i = 0;
  function typing() {
    if (i < content.length) {
      text.textContent += content.charAt(i);
      i++;
      setTimeout(typing, 60);
    }
  }
  typing();
}

export { typeText };
