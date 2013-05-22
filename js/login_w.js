var login_chooser = document.getElementById('login_chooser');
var reg_chooser = document.getElementById('reg_chooser');

login_chooser.onclick = function(e) {
  login_chooser.className = 'chooser chooser_selected';
  reg_chooser.className = 'chooser';
  var form = document.getElementById('login_or_reg_form');
  var html = '\
    <input type="text" placeholder="E-mail">\
    <input type="password" placeholder="Пароль">\
    <button id="login_button_login">Войти</button>\
    <span id="login_recover_link"><a href="/">Забыли пароль?</a></span>';

  form.innerHTML = html;
}

reg_chooser.onclick = function(e) {
  reg_chooser.className = 'chooser chooser_selected';
  login_chooser.className = 'chooser';
  var form = document.getElementById('login_or_reg_form');
  var html = '\
    <input type="text" placeholder="E-mail">\
    <input type="password" placeholder="Пароль">\
    <input type="password" placeholder="Еще раз пароль">\
    <button id="login_button_reg">Зарегистрироваться</button>';

  form.innerHTML = html;
}