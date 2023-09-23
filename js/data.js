let data = {
  view: '',
  search: [],
  id: 1
};

window.addEventListener('beforeunload', function () {
  localStorage.setItem('javascript-local-storage', JSON.stringify(data));
});

if (localStorage.getItem('javascript-local-storage') !== null) {
  JSON.parse(localStorage.getItem('javascript-local-storage'));
}