(function () {
  /* Год в футере */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Закрываем бургер-меню после клика по пункту */
  var nav = document.getElementById('mainNav');
  if (nav && window.bootstrap) {
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(nav).hide();
        }
      });
    });
  }


  /* ---------- Формы заявок (на всех страницах) ----------
     Вставьте адрес обработчика (Formspree / Getform / Web3Forms / свой).
     Пока пусто — форма в демо-режиме.
     Можно задать свой адрес для конкретной формы через data-endpoint="...".
  */
  var DEFAULT_ENDPOINT = "";

  document.querySelectorAll('form.lead-form').forEach(function (form) {
    var errBox = form.querySelector('.err');
    var okBox = form.querySelector('.ok');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (errBox) errBox.textContent = '';
      if (okBox) okBox.style.display = 'none';

      var f = form.elements;
      var name = (f.namedItem('name') ? f.namedItem('name').value : '').trim();
      var phone = (f.namedItem('phone') ? f.namedItem('phone').value : '').trim();

      if (name.length < 2) { if (errBox) errBox.textContent = 'Укажите имя.'; return; }
      if (phone.length < 6) { if (errBox) errBox.textContent = 'Укажите телефон или Telegram.'; return; }

      /* Собираем все именованные поля формы */
      var data = {};
      Array.from(form.elements).forEach(function (el) {
        if (el.name && el.type !== 'submit' && el.type !== 'button') {
          data[el.name] = el.value.trim();
        }
      });

      var endpoint = form.dataset.endpoint || DEFAULT_ENDPOINT;
      if (!endpoint) {
        if (okBox) {
          okBox.textContent = 'Демо-режим: заявка не отправлена. Подключите обработчик в scripts.js.';
          okBox.style.display = 'block';
        }
        return;
      }

      try {
        var res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('bad status ' + res.status);
        if (okBox) {
          okBox.textContent = 'Заявка отправлена! Свяжусь с вами в ближайшее время.';
          okBox.style.display = 'block';
        }
        form.reset();
      } catch (err) {
        if (errBox) errBox.textContent = 'Не удалось отправить. Позвоните или напишите в Telegram.';
      }
    });
  });
})();