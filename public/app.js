// list.ejs에서 메모 클릭 시 show.ejs로 이동
const viewMemo = (id) => {
  window.location.href = `/show/${id}`;
};

// Delete버튼
const deleteButton = document.querySelector(".delete-btn");
deleteButton.addEventListener("click", () => {
  const memoId = deleteButton.dataset.id;
  if (confirm("삭제하시겠습니까?")) {
    fetch(`/delete/${memoId}`, {
      method: "POST",
    })
      .then(function (res) {
        if (res.redirected) {
          // 삭제 후 리다이렉션된 페이지로 이동
          window.location.href = res.url;
        } else {
          throw new Error("삭제 오류");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
