// Переключение вкладок
function switchTab(tabName) {
  const tabDoc = document.getElementById('tab-doc');
  const tabDetails = document.getElementById('tab-details');
  const topShareBtn = document.getElementById('top-share-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => btn.classList.remove('active'));

  if (tabName === 'doc') {
    tabDoc.classList.add('active');
    tabDetails.classList.remove('active');
    tabBtns[0].classList.add('active');
    topShareBtn.style.display = 'flex'; // Показываем верхнюю иконку
  } else {
    tabDoc.classList.remove('active');
    tabDetails.classList.add('active');
    tabBtns[1].classList.add('active');
    topShareBtn.style.display = 'none'; // Скрываем верхнюю иконку
  }
}

// Вызов стандартного окна «Поделиться» на iPhone
document.getElementById('share-details-btn').addEventListener('click', async () => {
  const textToShare = 
`Удостоверение личности

Номер документа: 059261764
ИИН: 031103551653
ФИО: ЗӘРУБАЕВ СЕРІКБОЛСЫН АСХАТҰЛЫ
Дата рождения: 03.11.2005
Дата выдачи: 30.10.2024
Срок выдачи: 29.10.2034
Орган выдачи: ҚР ІШКІ ІСТЕР МИНИСТРЛІГІ
Национальность: ҚАЗАҚ`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Реквизиты удостоверения личности',
        text: textToShare
      });
    } catch (err) {
      console.log('Отмена или ошибка:', err);
    }
  } else {
    navigator.clipboard.writeText(textToShare);
    alert('Реквизиты скопированы в буфер обмена!');
  }
});
