if (document.getElementById("orderForm") && sessionStorage.getItem  ("loggedInUser") === null) {
  window.location.href = "signin.html";
}

if (document.getElementById("orderForm")) {
  var qtyInputs = document.querySelectorAll(".qty");
  var totalBox = document.getElementById("totalBox");
  var errorBox = document.getElementById("errorBox");
  var summary = document.getElementById("summary");


  function val(id) {
    return document.getElementById(id).value.trim();
  }


  function calculate() {
    var subtotal = 0;
    qtyInputs.forEach(function (q) {
      subtotal += q.dataset.price * q.value;   
    });

    var discount = subtotal >= 500 ? subtotal * 0.10 : 0;                 
    var delivery = (subtotal > 0 && subtotal < 300) ? 40 : 0;             

    return { subtotal: subtotal, discount: discount, delivery: delivery,
             total: subtotal - discount + delivery };
  }

  function totalText() {
    var a = calculate();
    return "Subtotal: ₹" + a.subtotal.toFixed(2) + "<br>" +
           "Discount: ₹" + a.discount.toFixed(2) + "<br>" +
           "Delivery Charge: ₹" + a.delivery.toFixed(2) + "<br>" +
           "<b>Total: ₹" + a.total.toFixed(2) + "</b>";
  }

  function updateTotal() {
    totalBox.innerHTML = totalText();
  }

  qtyInputs.forEach(function (q) {
    q.addEventListener("input", updateTotal);   
  });
  updateTotal();   


  function validate() {
    var errors = [];
    var quantityOk = true;
    var itemsOrdered = 0;

    qtyInputs.forEach(function (q) {
      var n = Number(q.value);
      if (!Number.isInteger(n) || n < 0 || n > 10) quantityOk = false;
      if (n > 0) itemsOrdered++;
    });

    if (!quantityOk) errors.push("Quantity must be a whole number from 0 to 15.");
    else if (itemsOrdered === 0) errors.push("Please order at least one item.");

    if (val("name").length < 3) errors.push("Name must be at least 3 characters.");
    if (!/^[0-9]{10}$/.test(val("phone"))) errors.push("Phone number must be exactly 10 digits.");
    if (val("address")=="") errors.push("Please enter delivery address.");
    if (val("payment") === "") errors.push("Please select a payment method.");

    return errors;
  }

  document.getElementById("orderForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var errors = validate();


    if (errors.length > 0) {
      errorBox.innerHTML = "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
      summary.style.display = "none";
      return;
    }
    errorBox.innerHTML = "";

    var rows = "";
    qtyInputs.forEach(function (q) {
      if (q.value > 0) {
        rows += "<tr><td>" + q.dataset.name + "</td><td>₹" + q.dataset.price +
                "</td><td>" + q.value + "</td><td>₹" + q.dataset.price * q.value + "</td></tr>";
      }
    });


    summary.innerHTML =
      "<h2>Order Summary</h2>" +
      "<p>Thank you, <b>" + val("name") + "</b>! Your order has been placed.</p>" +
      "<table><tr><th>Item</th><th>Price</th><th>Qty</th><th>Amount</th></tr>" + rows + "</table>" +
      "<div class='total-box'>" + totalText() + "</div>" +
      "<p><b>Phone:</b> " + val("phone") + "</p>" +
      "<p><b>Address:</b> " + val("address") + "</p>" +
      "<p><b>Payment:</b> " + val("payment") + "</p>";

    summary.style.display = "block";
    summary.scrollIntoView();
  });


  document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
      button.nextElementSibling.classList.toggle("show"); 
    });
  });
}

if (document.getElementById("signupForm")) {
  document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim().toLowerCase();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm").value;
    var errorBox = document.getElementById("errorBox");
    var message = document.getElementById("message");

    var users = JSON.parse(localStorage.getItem("users")) || [];
    var errors = [];

    if (name.length < 3) errors.push("Name must be at least 3 characters.");
    if (!email.includes("@") || !email.includes(".")) errors.push("Please enter a valid email.");
    if (password.length < 6) errors.push("Password must be at least 6 characters.");
    if (password !== confirmPassword) errors.push("Passwords do not match.");

    users.forEach(function (u) {
      if (u.email === email) errors.push("This email is already registered. Please sign in.");
    });

    if (errors.length > 0) {
      errorBox.innerHTML = "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
      message.innerHTML = "";
      return;
    }

    users.push({ name: name, email: email, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    errorBox.innerHTML = "";
    message.innerHTML = "Account created! You can now <a href='signin.html'>sign in</a>.";
    document.getElementById("signupForm").reset();
  });
}

if (document.getElementById("signinForm")) {
  document.getElementById("signinForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value.trim().toLowerCase();
    var password = document.getElementById("password").value;
    var errorBox = document.getElementById("errorBox");
    var message = document.getElementById("message");

    var users = JSON.parse(localStorage.getItem("users")) || [];
    var errors = [];
    var foundUser = null;

    if (email === "") errors.push("Please enter your email.");
    if (password === "") errors.push("Please enter your password.");

    if (errors.length === 0) {
      users.forEach(function (u) {
        if (u.email === email && u.password === password) foundUser = u;
      });
      if (foundUser === null) errors.push("Wrong email or password.");
    }

    if (errors.length > 0) {
      errorBox.innerHTML = "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
      message.innerHTML = "";
      return;
    }

    errorBox.innerHTML = "";
    sessionStorage.setItem("loggedInUser", foundUser.name);
    window.location.href = "index.html";
  });
}