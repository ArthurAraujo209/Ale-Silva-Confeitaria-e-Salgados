const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];

//ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//FECHAR O MODAL DO CARRINHO COM BOTÃO
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function(event){
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

menu.addEventListener("click", function(){
    
    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name =  parentButton.getAttribute("data-name")
        const price =  parseFloat(parentButton.getAttribute("data-price"))
        
        console.log(name)
        console.log(price)
        
        //ADD NO CARRINHO
        
        addToCart(name, price)
    }
})

//FUNÇÃO PARA ADICIONAR NO CARRINHO

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    
    
    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({
            price,
            name,
            quantity: 1,
        })
    }
    
    updateCartModal()
    
    
}

function updateCartModal(){
    cartItemsContainer.innerHTML = ""; 
    let total = 0;
    
    
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
        <div>
        <p class="font-bold">${item.name}</p>
        <p>Qtd.: ${item.quantity}</p>
        <p class="font=medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        
        
        <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
        </button>
        
        </div>
        `
        
        cartItemsContainer.appendChild(cartItemElement)
        
        total += item.price * item.quantity
    })
    
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    
    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)
    
    if(index !== -1){
        const item = cart[index];
        console.log(item);
        
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal()
            return;
        }
        
        cart.splice(index, 1);
        updateCartModal();
    }
}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function(){
    
    
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops! O restaurante está fechado, volte as 18:00",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        
        return;
    }
    
    
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
    
    
    //ENVIAR PARA A API DO WHATS
    
    const cartItems = cart.map((item) => {
        return (
            `|*${item.name}* Quantidade: (*${item.quantity}*) Preço: *R$${item.price}*| \n`
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems)
    const phone = "5583996607709"
    
    window.open(`https://wa.me/${phone}?text=${message} \n \n*Endereço*: ${addressInput.value}`, "_blank")
    
    cart = [];
    updateCartModal();
})









//Manipular o Card do horário
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("gb-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("gb-green-600");
    spanItem.classList.add("bg-red-500");
}


const botao = document.getElementById("add-botao");

botao.onclick = function(){
    Toastify({
            text: "Produto adicionado ao carrinho",
            duration: 1500,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "rgb(34 197 94 )",
            },
        }).showToast();
}

