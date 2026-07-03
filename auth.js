/* ==========================================================
   QIVE — PROTEÇÃO POR PIN (compartilhada entre todas as páginas)
   ----------------------------------------------------------
   Como funciona:
   - O PIN correto fica definido em CORRECT_PIN, abaixo.
   - Ao acessar QUALQUER página que carregue este script, o
     usuário precisa digitar o PIN uma única vez.
   - Uma vez validado, o acesso fica salvo no localStorage do
     navegador. Como todas as páginas do projeto rodam sob o
     mesmo domínio (github.io/campanha/...), o localStorage é
     compartilhado — ou seja, o usuário não precisa digitar o
     PIN de novo ao navegar entre a página central e as páginas
     de campanha.
   - Proteção 100% client-side (não existe backend no GitHub
     Pages). Isso significa que é uma barreira de acesso casual,
     não uma segurança real — qualquer pessoa com conhecimento
     técnico pode ler o PIN no código-fonte. Serve para impedir
     acesso não intencional, não para proteger dados sigilosos.

   Como usar em uma página nova:
   Adicione esta linha no <head>, o mais no topo possível:
     <script src="auth.js"></script>            (se a página está na raiz)
     <script src="../auth.js"></script>          (se a página está em uma subpasta)
   Não é necessário nenhum outro HTML/CSS/JS de PIN na página.
========================================================== */
(function () {
  "use strict";

  var CORRECT_PIN = "478569";
  var STORAGE_KEY = "qive_campanhas_pin_ok";

  // Já autenticado nesta sessão do navegador? Libera a página e para por aqui.
  if (localStorage.getItem(STORAGE_KEY) === "1") {
    return;
  }

  // Esconde a página imediatamente para evitar "flash" de conteúdo
  // antes da checagem do PIN.
  document.documentElement.style.visibility = "hidden";

  function buildGate() {
    var style = document.createElement("style");
    style.textContent =
      "#qive-pin-gate{position:fixed;inset:0;background:#1A1A1A;display:flex;" +
      "align-items:center;justify-content:center;z-index:999999;padding:24px;" +
      "font-family:'DM Sans',sans-serif;}" +
      "#qive-pin-gate .pin-box{background:#fff;border-radius:14px;padding:40px 36px;" +
      "width:100%;max-width:340px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.35);" +
      "box-sizing:border-box;}" +
      "#qive-pin-gate .pin-badge{display:inline-block;background:#E95A1C;color:#fff;" +
      "font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;" +
      "padding:5px 12px;border-radius:4px;margin-bottom:18px;}" +
      "#qive-pin-gate h2{font-family:'DM Serif Display',serif;font-weight:400;" +
      "font-size:22px;margin:0 0 6px;color:#1A1A1A;}" +
      "#qive-pin-gate p{color:#6B6B6B;font-size:13px;margin:0 0 22px;}" +
      "#qive-pin-gate input{width:100%;font-family:'DM Sans',sans-serif;font-size:22px;" +
      "letter-spacing:8px;text-align:center;padding:12px 10px;border:1px solid #E5E3DC;" +
      "border-radius:8px;outline:none;margin-bottom:14px;color:#1A1A1A;box-sizing:border-box;}" +
      "#qive-pin-gate input:focus{border-color:#E95A1C;}" +
      "#qive-pin-gate button{width:100%;background:#E95A1C;color:#fff;border:none;" +
      "padding:12px;border-radius:8px;font-size:14px;font-weight:600;" +
      "font-family:'DM Sans',sans-serif;cursor:pointer;}" +
      "#qive-pin-gate button:hover{background:#F97C45;}" +
      "#qive-pin-gate .pin-error{color:#C0392B;font-size:12px;margin-top:12px;min-height:16px;}";
    document.head.appendChild(style);

    var gate = document.createElement("div");
    gate.id = "qive-pin-gate";
    gate.innerHTML =
      '<div class="pin-box">' +
      '<div class="pin-badge">Acesso Restrito</div>' +
      "<h2>Digite o PIN</h2>" +
      "<p>Este conteúdo é de uso interno do time Qive.</p>" +
      '<input type="password" id="qive-pin-input" maxlength="6" inputmode="numeric" ' +
      'pattern="[0-9]*" placeholder="••••••" autocomplete="off">' +
      '<button type="button" id="qive-pin-submit">Entrar</button>' +
      '<div class="pin-error" id="qive-pin-error"></div>' +
      "</div>";
    document.body.appendChild(gate);
    document.documentElement.style.visibility = "visible";

    var input = document.getElementById("qive-pin-input");
    var error = document.getElementById("qive-pin-error");

    function checkPin() {
      var value = input.value.trim();
      if (value === CORRECT_PIN) {
        localStorage.setItem(STORAGE_KEY, "1");
        gate.remove();
      } else {
        error.textContent = "PIN incorreto. Tente novamente.";
        input.value = "";
        input.focus();
      }
    }

    document.getElementById("qive-pin-submit").addEventListener("click", checkPin);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") checkPin();
    });
    input.focus();
  }

  if (document.body) {
    buildGate();
  } else {
    document.addEventListener("DOMContentLoaded", buildGate);
  }
})();
