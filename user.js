const supabaseUrl = "https://yalbollfaqnqqobrxyxb.supabase.co"
const supabaseKey = "sb_publishable_7vjj_HjtvjbBPIm6OjiSwg_kxUHB95b"

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
const togglePassword = document.getElementById("toggle-password");
const signupPassword = document.getElementById("signup-password");
const categoryBoxes = document.querySelectorAll(".category-box");
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");
const toggleLoginPassword = document.getElementById("toggle-login-password");
const loginPassword = document.getElementById("login-password");
let appliedDiscount = 0
let appliedCode = null
let discountData = null
const instructions = document.getElementById("order-instructions").value.trim();;
const fullMenuBtn = document.querySelector(".full-menu-btn");
const pageContent = document.getElementById("page-content");
const fullMenuSection = document.getElementById("full-menu-section");
const closeMenuBtn = document.getElementById("close-menu");
const categories = document.querySelectorAll(".menu-category");
const menuGroups = document.querySelectorAll(".menu-group");
// select only cards inside menu-items section
const menuCards = document.querySelectorAll(".menu-items .menu-card");

const popup = document.getElementById("food-popup");
const popupImg = document.getElementById("popup-img");
const popupName = document.getElementById("popup-name");
const popupDesc = document.getElementById("popup-desc");
const popupPrice = document.getElementById("popup-price");
const searchResultsContainer = document.getElementById("search-results");
const closePopup = document.getElementById("close-popup");
// ===============================
// ELEMENTS
// ===============================
const authPopup = document.getElementById("auth-popup")
const closeAuth = document.getElementById("close-auth")

const googleLoginBtn = document.getElementById("google-login-btn")
const logoutBtn = document.getElementById("logout-btn")

const profileIcon = document.getElementById("profile-icon")
const profileMenu = document.getElementById("profile-menu")
async function initAuth(){

const { data: { session } } = await supabaseClient.auth.getSession()



if(session){
currentSession = session
loadUserProfile(session.user)
}

}

initAuth()
let currentSession = null

async function checkLogin(){

const { data: { session } } = await supabaseClient.auth.getSession()

currentSession = session

if(session){

loadUserProfile(session.user)

await saveUserToDB(session.user)

}
const { data: { user } } = await supabaseClient.auth.getUser();
if (!user) return;
await supabaseClient.from("users").upsert({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || "User"
});

}

checkLogin()

profileIcon.addEventListener("click", async () => {

const { data: { session } } = await supabaseClient.auth.getSession()

if(session){
profileMenu.classList.toggle("hidden")
}else{
authPopup.classList.remove("hidden")
}

})
googleLoginBtn.addEventListener("click", async () => {

await supabaseClient.auth.signInWithOAuth({
provider: "google",
options: {
redirectTo: window.location.origin + "/user.html"
}
})

})

logoutBtn.addEventListener("click", async () => {

await supabaseClient.auth.signOut()

currentSession = null

profileMenu.classList.add("hidden")


})

closeAuth.addEventListener("click", () => {

authPopup.classList.add("hidden")

})

supabaseClient.auth.onAuthStateChange((event, session)=>{

currentSession = session

if(event === "SIGNED_IN"){

authPopup.classList.add("hidden")

loadUserProfile(session.user)

saveUserToDB(session.user)

}

if(event === "SIGNED_OUT"){

profileMenu.classList.add("hidden")

}

})

function loadUserProfile(user){

if(!user) return

const name = user.user_metadata.full_name
const avatar = user.user_metadata.avatar_url

const nameEl = document.getElementById("profile-name")
const avatarEl = document.getElementById("profile-avatar")

if(nameEl) nameEl.textContent = name
if(avatarEl) avatarEl.src = avatar

}

async function saveUserToDB(user){

if(!user) return

await supabaseClient
.from("users")
.upsert([
{
id: user.id,
email: user.email,
name: user.user_metadata.full_name,
avatar: user.user_metadata.avatar_url
}
])

}
//redirects to full menu category which clicked
categoryBoxes.forEach(box => {
    box.addEventListener("click", () => {
        const category = box.dataset.category;
        // Hide main page content
        pageContent.classList.add("hidden");
        // Show full menu
        fullMenuSection.classList.remove("hidden");
        // Activate the clicked category
        categories.forEach(cat => cat.classList.toggle("active", cat.dataset.category === category));
        menuGroups.forEach(group => group.id === category ? group.classList.add("active") : group.classList.remove("active"));
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});


closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
});


const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const searchIcon = document.querySelector(".search-container i");
const mobileSearch = document.getElementById("search-bar-mobile");

//mobile search
mobileSearch.addEventListener("input", e => performSearch(e.target.value));

mobileSearch.addEventListener("keydown", e => {
    if (e.key === "Enter") performSearch(mobileSearch.value);
});


// Function to handle search
function performSearch(query) {
    query = query.toLowerCase();
    const results = items.filter(item => item.toLowerCase().includes(query));
    // Future: render results on page
}

//perform search
function performSearch(query) {
    query = query.toLowerCase();

    const allCards = document.querySelectorAll(".menu-card");

    const results = Array.from(allCards).filter(card =>
        card.dataset.name && card.dataset.name.toLowerCase().includes(query)
    );

    // Clear previous results
    searchResultsContainer.textContent = "";

    if (results.length === 0 || query.trim() === "") {
        searchResultsContainer.classList.add("hidden");
        return;
    }

    searchResultsContainer.classList.remove("hidden");

    results.forEach(card => {
        const resultCard = document.createElement("div");
        resultCard.classList.add("search-card");
        resultCard.innerHTML = `
            <img src="${card.dataset.img}" alt="${card.dataset.name}">
            <h4>${card.dataset.name}</h4>
            <p class="price">₹${card.dataset.price}</p>
        `;

        // Click on search result → open popup
        resultCard.addEventListener("click", () => {
            // Populate popup with the selected item's data
            popupImg.src = card.dataset.img || "";
            popupName.textContent = card.dataset.name || "No Name";
            popupDesc.textContent = card.dataset.desc || "No Description";
            popupPrice.textContent = card.dataset.price || "₹0";
            const price = card.dataset.price || 0;
            popupPrice.textContent = `₹${price}`;

            // Show popup
            popup.classList.remove("hidden");  // remove hidden
            popup.classList.add("active");     // add active

            // Hide search results
            searchResultsContainer.classList.add("hidden");

            // Scroll to top so popup is visible
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        searchResultsContainer.appendChild(resultCard);
    });
}

// Event listeners
searchBar.addEventListener("input", e => performSearch(e.target.value));
searchBar.addEventListener("keydown", e => {
    if (e.key === "Enter") performSearch(searchBar.value);
});


// full menu close
closeMenuBtn.addEventListener("click", () => {
    fullMenuSection.classList.add("hidden");
    pageContent.classList.remove("hidden");
});
//added cart popup
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toast-message");
const toastClose = document.getElementById("toast-close");

let toastTimeout;

// Show Toast Function
function showToast(message) {
  toastMsg.textContent = message;

  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("show"), 10);

  // Auto hide after 5 sec
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(hideToast, 5000);
}

// Hide Toast
function hideToast() {
  toast.classList.remove("show");
  setTimeout(() => toast.classList.add("hidden"), 300);
}

// Close button
toastClose.addEventListener("click", hideToast);
//cart
let cart = []

const cartIcon = document.getElementById("cart-icon")
const cartPopup = document.getElementById("cart-popup")
const cartItemsContainer = document.getElementById("cart-items")
const cartCount = document.getElementById("cart-count")
const totalPriceEl = document.getElementById("total-price")

// Add item to cart
function addToCart(name, price){

let item = cart.find(i => i.name === name)

if(item){
item.qty++
}else{
cart.push({name, price, qty:1})
}

updateCart()
}

// Update cart UI
function updateCart(){

  cartItemsContainer.innerHTML = ""

  let subtotal = cart.reduce((sum,item)=>sum+(item.price*item.qty),0)

let delivery = subtotal >= 199 ? 0 : 10

appliedDiscount = 0

if(discountData){

if(discountData.type === "%"){
appliedDiscount = subtotal * discountData.value / 100
}
else{
appliedDiscount = discountData.value
}

}

let finalTotal = subtotal + delivery - appliedDiscount
  

if(finalTotal < 0) finalTotal = 0

totalPriceEl.textContent = finalTotal
document.getElementById("total-price").textContent = '₹'+finalTotal

  cart.forEach((item,index)=>{
    const itemTotal = `${item.price * item.qty}`

    const div = document.createElement("div")

    div.classList.add("cart-item")

    div.innerHTML = `
           <h4>${item.name}</h4>
      <div id="cartflex">
        <div class="item-total">₹${itemTotal}</div>
        ${item.isReward ? `
          
        ` : `
          <button onclick="decreaseQty(${index})">-</button>
          <span style="margin-left:10px;margin-right:10px;">${item.qty}</span>
          <button onclick="increaseQty(${index})">+</button>
        `}
        <button onclick="removeItem(${index})">Remove</button>
      </div>
      
    `

    cartItemsContainer.appendChild(div)

  })

  let deliveryCharge = 0
  let deliveryNote = ''

    if (subtotal > 0 && subtotal < 199) deliveryCharge = 10;

    // Show delivery charge in cart
    if (deliveryCharge > 0) {
        const deliveryDiv = document.createElement("div");
        deliveryDiv.classList.add("cart-delivery");
        deliveryDiv.innerHTML = `<span>Delivery Charge:</span> <span>₹${deliveryCharge}</span>`;
        cartItemsContainer.appendChild(deliveryDiv);

        // Optional: note for free delivery
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("cart-note");
        noteDiv.textContent = "minimum cart value should be ₹199 for free delivery!";
        cartItemsContainer.appendChild(noteDiv);
    }



  cartCount.textContent = cart.length + " items"

  // Show delivery note
  const deliveryNoteEl = document.getElementById("delivery-note")
  if(deliveryNoteEl){
    deliveryNoteEl.textContent = deliveryNote
  }
}

// Increase quantity
function increaseQty(i){
cart[i].qty++
updateCart()
}

// Decrease quantity
function decreaseQty(i){

if(cart[i].qty > 1){
cart[i].qty--
}else{
cart.splice(i,1)
}

updateCart()

}

// Remove item
function removeItem(i) {
    const removedItem = cart.splice(i, 1)[0];

    // If it was a reward item, re-enable its button
    if (removedItem.isReward) {
        const rewardBtn = document.querySelector(`button[data-reward-name="${removedItem.name}"]`);
        if (rewardBtn) rewardBtn.disabled = false;
    }

    updateCart();
}

// Add click to menu buttons
document.addEventListener("click",function(e){

if(e.target.closest(".add-cart-btn")){

const card = e.target.closest(".menu-card,.food-card")

const name = card.dataset.name
const price = parseInt(card.dataset.price)

addToCart(name,price)
showToast("Item added to cart 🛒");
}

})

//apply discount
document.getElementById("apply-discount").onclick = applyDiscount

async function applyDiscount() {
    const code = document.getElementById("discount-input").value.trim().toUpperCase();
    const msg = document.getElementById("discount-message");

    if (!code) {
        msg.textContent = "Enter a code";
        return;
    }

    // Fetch discount from Supabase
    const { data, error } = await supabaseClient
        .from("discount_codes")
        .select("*")
        .eq("code", code)
        .eq("active", true)
        .single();

    if (!data) {
        msg.textContent = "Invalid code";
        return;
    }

    const user = (await supabaseClient.auth.getUser()).data.user;

    // Check if one_per_user
    if (data.one_per_user) {
        const { data: used } = await supabaseClient
            .from("user_used_codes")
            .select("*")
            .eq("user_id", user.id)
            .eq("code", code);

        if (used.length) {
            msg.textContent = "You already used this code";
            return;
        }
    }

    // Calculate subtotal
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Check min_cart
    if (data.min_cart && subtotal < data.min_cart) {
        msg.textContent = `Minimum cart ₹${data.min_cart}`;
        return;
    }

    // Check item_only
    if (data.item_only) {
        const hasItem = cart.some(item => item.category === data.item_only);
        if (!hasItem) {
            msg.textContent = `Valid only on ${data.item_only}`;
            return;
        }
    }

    // --- APPLY DISCOUNT ---
    let discountAmount = 0;

    if (data.type === "percent") {
        // Correct calculation for percentage discount
        discountAmount = subtotal * (data.value / 100);
    } else if (data.type === "amount") {
        // Fixed amount discount
        discountAmount = data.value;
    }

    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) discountAmount = subtotal;

    // Save discount data globally
    discountData = {
        ...data,
        discountAmount
    };
    appliedCode = code;

    // Update UI
    msg.textContent = `Code applied successfully`;
    const appliedBox = document.getElementById("applied-coupon");
    const appliedText = document.getElementById("applied-coupon-text");
    appliedText.textContent = `Coupon Applied: ${code}`;
    appliedBox.classList.remove("hidden");
    document.getElementById("discount-input").disabled = true;
    document.getElementById("apply-discount").disabled = true;

    // Refresh cart totals
    updateCart();
}
//remove discount
document.getElementById("remove-coupon").addEventListener("click", () => {

appliedCode = null
discountData = null
appliedDiscount = 0

// Enable input again
document.getElementById("discount-input").disabled = false
document.getElementById("apply-discount").disabled = false

// Clear input field
document.getElementById("discount-input").value = ""

// Hide applied coupon box
document.getElementById("applied-coupon").classList.add("hidden")

// Remove success message
document.getElementById("discount-message").textContent = ""

// Recalculate cart total without discount
updateCart()

})

// Open cart popup
cartIcon.addEventListener("click",()=>{
cartPopup.classList.toggle("hidden")
})

document.getElementById("popup-add-cart").addEventListener("click",()=>{
    
    const name = popupName.textContent
const price = parseInt(popupPrice.textContent.replace("₹",""))
showToast("Item added to cart 🛒");
addToCart(name,price)

})

//close cart
const closeCart = document.getElementById("close-cart")

closeCart.addEventListener("click", () => {

cartPopup.classList.add("hidden")

})

//menu navigations
categories.forEach(category => {

    category.addEventListener("click", () => {

        const target = category.dataset.category;

        categories.forEach(c => c.classList.remove("active"));
        category.classList.add("active");

        menuGroups.forEach(group => {

            if(group.id === target){
                group.classList.add("active");
            } else {
                group.classList.remove("active");
            }

        });

    });

});


//food rating avg
//show avg rating 
async function loadFoodRating(foodName){

const { data } = await supabaseClient
.from("food_ratings")
.select("rating")
.eq("food_name", foodName)

if(!data || data.length === 0) return null

const avg =
data.reduce((sum,r)=>sum+r.rating,0) / data.length

return avg.toFixed(1)

}

// Function to open popup with card data
async function openFoodPopup(card) {

popupImg.src = card.dataset.img || "";
popupName.textContent = card.dataset.name || "No Name";
popupDesc.textContent = card.dataset.desc || "No Description";
popupPrice.textContent = card.dataset.price || "₹0";
const price = card.dataset.price || 0;
popupPrice.textContent = `₹${price}`;

/* ⭐ STEP 8 CODE GOES HERE */

const rating = await loadFoodRating(card.dataset.name)

if(rating){

document.getElementById("popup-rating").innerHTML =
`★ ${rating} stars rated`

}else{

document.getElementById("popup-rating").innerHTML =
`★ 4.5 stars rated`

}

popup.classList.remove("hidden");
popup.classList.add("active");

window.scrollTo({ top: 0, behavior: "smooth" });

}


// Close popup
closePopup.addEventListener("click", () => {
    popup.classList.remove("active");
    popup.classList.add("hidden");
});

function attachPopupToCards() {
    const allMenuCards = document.querySelectorAll(".menu-card");

    allMenuCards.forEach(card => {
        card.addEventListener("click", (e) => {
            if(e.target.closest(".add-cart-btn")) return; // ✅ Ignore clicks on add-cart button
            
            openFoodPopup(card);
        });
    });
}

//full menu btn click
fullMenuBtn.addEventListener("click", () => {

    // Hide main page
    pageContent.classList.add("hidden");

    // Show full menu
    fullMenuSection.classList.remove("hidden");

    // Default category → pizza (or first one)
    categories.forEach(cat => {
        cat.classList.remove("active");
    });

    categories[0].classList.add("active");

    // Show first menu group
    menuGroups.forEach(group => group.classList.remove("active"));
    menuGroups[0].classList.add("active");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

});

//load menu from superbase
async function loadMenu() {
    const { data, error } = await supabaseClient
        .from("menu-content")
        .select("*");

    if (error) {
        return;
    }

    // Clear all menu groups first
    const menuGroups = document.querySelectorAll(".menu-group");
    menuGroups.forEach(group => group.innerHTML = "");

    // Add each item to its category container
    for (const food of data) {

    const rating = await loadFoodRating(food.name)

    const ratingHTML = rating
    ? `★ ${rating}`
    : `★ 4.5`

    const categoryContainer = document.getElementById(food.category);

    categoryContainer.innerHTML += `
    <div class="menu-card"
        data-name="${food.name}"
        data-price="${food.price}"
        data-img="${food.image}"
        data-desc="${food.desc}">

    <img src="${food.image}">
    <h4>${food.name}</h4>

    <div class="food-rating">${ratingHTML}</div>

    <p class="price">₹${food.price}</p>

    <button class="add-cart-btn">
    <i class="fa-solid fa-plus"></i>
    </button>

    </div>
    `;
    }
    attachPopupToCards();
}

loadMenu();

//offer banner 
async function loadOfferBanner(){

const { data, error } = await supabaseClient
.from("offer-banner")
.select("*")
.limit(1)

if(error){
return
}

const banner = data[0]

document.getElementById("offerHeading").textContent = banner.heading
document.getElementById("offerDescription").textContent = banner.description
document.getElementById("offerButton").textContent = banner.button

document.getElementById("offerBanner").style.backgroundImage =
`url(${banner.image})`

}

loadOfferBanner()

//add to cart icon in items
document.querySelectorAll(".add-cart-btn").forEach(btn=>{
btn.addEventListener("click", e=>{
e.stopPropagation()
if(!btn) return
const card = btn.closest(".menu-card")

const name = card.dataset.name
const price = parseInt(card.dataset.price)

addToCart(name, price)
});
});

//offers section and offer banner click handler
// Open Full Menu with Offers category
function openFullMenuCategory(categoryId) {
    // Show full menu
    pageContent.classList.add("hidden");
    fullMenuSection.classList.remove("hidden");

    // Activate selected category in left menu
    categories.forEach(cat => cat.classList.toggle("active", cat.dataset.category === categoryId));

    // Show corresponding menu group
    menuGroups.forEach(group => group.id === categoryId ? group.classList.add("active") : group.classList.remove("active"));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Attach to each offer card dynamically
function attachOfferClickToFullMenu() {
    const offerCards = document.querySelectorAll(".offer-card");
    offerCards.forEach(card => {
        card.addEventListener("click", () => {
            openFullMenuCategory("offers");
        });
    });

    // Also attach to Offer banner button
    const offerBannerBtn = document.getElementById("offerButton");
    offerBannerBtn.addEventListener("click", () => {
        openFullMenuCategory("offers");
    });
}

//enjoy offer 
async function loadEnjoyOffers() {
    const { data, error } = await supabaseClient
        .from("enjoy_offers")
        .select("*")
        .eq("is_active", true)
        .order("id", { ascending: true });

    if (error) {
        return;
    }

    const container = document.getElementById("offersContainer");
    if (!container) {
        return;
    }

    container.innerHTML = ""; // Clear previous offers

    data.forEach(offer => {
        const card = document.createElement("div");
        card.classList.add("offer-card");

        card.innerHTML = `
            <h3>${offer.title}</h3>
            <p>${offer.description}</p>
            <button class="get-offer-btn">${offer.button_text}</button>
        `;

        // Click handler → open full menu's offers category
        card.addEventListener("click", () => {
            openFullMenuCategory("offers");
        });

        container.appendChild(card);
    });

    // Also attach to Offer banner button
    const offerBannerBtn = document.getElementById("offerButton");
    offerBannerBtn.addEventListener("click", () => {
        openFullMenuCategory("offers");
    });

}

loadEnjoyOffers();

// Current logged-in user
let currentUser = null;

// Fetch current user session from Supabase
async function fetchCurrentUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) currentUser = session.user;
}

fetchCurrentUser();

// Calculate total cart price
function calculateTotal(cart) {
    if (!cart || cart.length === 0) return 0;

    // sum up price * quantity for each item
    return cart.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 0;
        return sum + price * qty;
    }, 0);
}
// ------------- PLACE ORDER -------------
// ------------- PLACE ORDER -------------

const orderBtn = document.getElementById("order-btn");
const orderDetailsPopup = document.getElementById('order-details-popup');
const savedAddressesDiv = document.getElementById('saved-addresses');
const cancelOrderBtn = document.getElementById('cancel-order');
const upiInstructions = document.getElementById('upi-instructions');

const paymentRadios = document.querySelectorAll('input[name="payment"]');

// toggle UPI message
paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    upiInstructions.style.display =
      radio.value === "UPI" && radio.checked ? "block" : "none";
  });
});

// open popup
document.addEventListener("click", async function(e){

if(!e.target.closest("#order-btn")) return;

if (!currentUser) {
showAlert("Login first");
return;
}

if (!cart || cart.length === 0) {
showAlert("Your cart is empty!");
return;
}

await loadSavedAddresses();

cartPopup.classList.add("hidden");
orderDetailsPopup.classList.remove("hidden");

});
// Load saved addresses
let selectedAddressId = null;

async function loadSavedAddresses(){

const { data: addresses, error } = await supabaseClient
.from("user_addresses")
.select("*")
.eq("user_id", currentUser.id);

if(error){
return
}

savedAddressesDiv.innerHTML=""

if(addresses.length === 0){

document.getElementById("address-form-container").style.display="block"
return

}

addresses.forEach(addr =>{

const div=document.createElement("div")

div.classList.add("saved-address")

div.dataset.id=addr.id

div.innerHTML=`
<div class="address-info">
<b>${addr.name}</b><br>
${addr.building}, ${addr.street || ""}<br>
${addr.landmark || ""}<br>
${addr.city} - ${addr.pincode}
</div>

<div class="address-actions">
<button class="edit-address">Edit</button>
<button class="delete-address">Delete</button>
</div>
`

// SELECT ADDRESS
div.addEventListener("click",()=>{

document.querySelectorAll(".saved-address")
.forEach(a=>a.classList.remove("selected"))

div.classList.add("selected")

selectedAddressId=addr.id

})

// DELETE ADDRESS
div.querySelector(".delete-address").addEventListener("click", async (e)=>{

e.stopPropagation()

const confirmDelete=confirm("Delete this address?")

if(!confirmDelete) return

const {error}=await supabaseClient
.from("user_addresses")
.delete()
.eq("id",addr.id)

loadSavedAddresses()

})

// EDIT ADDRESS
div.querySelector(".edit-address").addEventListener("click",(e)=>{

e.stopPropagation()

document.getElementById("address-form-container").style.display="block"

document.getElementById("addr-name").value=addr.name
document.getElementById("addr-phone").value=addr.phone
document.getElementById("addr-building").value=addr.building
document.getElementById("addr-street").value=addr.street || ""
document.getElementById("addr-landmark").value=addr.landmark || ""

selectedAddressId=addr.id

})

savedAddressesDiv.appendChild(div)

})

}

//add address
const addAddressBtn=document.getElementById("add-address-btn")

addAddressBtn.addEventListener("click",()=>{

document.getElementById("address-form-container").style.display="block"
document.querySelectorAll(".saved-address")
.forEach(a => a.classList.remove("selected"))

selectedAddressId = null

})

// Fill form for edit or select
function fillAddressForm(addr) {
  addressForm['addr-name'].value = addr.name;
  addressForm['addr-phone'].value = addr.phone;
  addressForm['addr-building'].value = addr.building;
  addressForm['addr-street'].value = addr.street || '';
  addressForm['addr-landmark'].value = addr.landmark || '';
  addressForm.dataset.addressId = addr.id; // store selected address
}

// Handle Place Order
const placeOrderBtn=document.getElementById("place-order-btn")

placeOrderBtn.addEventListener("click", async () => {

let finalAddressId = selectedAddressId;

// check if user filled form (new address)
const name = document.getElementById("addr-name").value.trim();
const phone = document.getElementById("addr-phone").value.trim();
const building = document.getElementById("addr-building").value.trim();
const street = document.getElementById("addr-street").value.trim();
const landmark = document.getElementById("addr-landmark").value.trim();

const userEnteredNewAddress = name || phone || building;
//if applied code
if(appliedCode){

await supabaseClient
.from("user_used_codes")
.insert({
user_id:currentUser.id,
code:appliedCode
})

}

// 👉 If user entered a new address, ignore selected address
if(userEnteredNewAddress){

if(!name || !phone || !building){
showAlert("Fill required fields");
return;
}

if(selectedAddressId){

const { error } = await supabaseClient
.from("user_addresses")
.update({
name,
phone,
building,
street,
landmark
})
.eq("id", selectedAddressId)

finalAddressId = selectedAddressId

}else{

const { data:newAddr, error } = await supabaseClient
.from("user_addresses")
.insert([{
user_id: currentUser.id,
name,
phone,
building,
street,
landmark,
pincode:"110092",
city:"New Delhi"
}])
.select()
.single()


finalAddressId = newAddr.id

}
}

// If no new address AND no selected address
if(!finalAddressId){
showAlert("Please select or add an address");
return;
}

// Payment method
const payment = document.querySelector('input[name="payment"]:checked').value;
//cancel place order
    const subtotal = calculateTotal(cart); // sum of items
    let deliveryCharge = (subtotal > 0 && subtotal < 199) ? 10 : 0;

    let discountAmount = appliedDiscount || 0; // use global appliedDiscount
    let finalTotal = subtotal + deliveryCharge - discountAmount;
    if(finalTotal < 0) finalTotal = 0;

const discountCode = appliedCode || null;
// Insert order
const { data:order, error:orderError } = await supabaseClient
.from("orders")
.insert([{
user_id: currentUser.id,
total_price: subtotal,
address_id: finalAddressId,
delivery_charge: deliveryCharge,
payment_method: payment,
total_cart:finalTotal,
discount_code: discountCode,     
discount_amount: discountAmount,
instructions: instructions  
}])
.select()
.single();

if(orderError){
showAlert("Order failed");
return;
}

// Insert items
const items = cart.map(item => ({
order_id: order.id,
food_name: item.name,
price: item.price,
quantity: item.qty
}));

await supabaseClient
.from("order_items")
.insert(items);

// Clear cart
cart = [];
updateCart();

// Close order details popup
orderDetailsPopup.classList.add("hidden");

// Show success popup
await addRewardCoins(finalTotal);
document.getElementById("order-success-popup").classList.remove("hidden");
resetRewardButtons()
});

//order placed successful ok btn
const successOkBtn = document.getElementById("success-ok-btn");

successOkBtn.addEventListener("click", () => {
  document.getElementById("order-success-popup").classList.add("hidden");
});

//reward coins
async function addRewardCoins(totalAmount) {

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const coinsToAdd = Math.floor(totalAmount * 0.5);

    let { data, error } = await supabaseClient
        .from("users")
        .select("coins")
        .eq("id", user.id)
        .maybeSingle();

    // If user doesn't exist → create
    if (!data) {
        await supabaseClient.from("users").insert({
            id: user.id,
            coins: coinsToAdd
        });

        return;
    }

    const newCoins = (data.coins || 0) + coinsToAdd;

    await supabaseClient
        .from("users")
        .update({ coins: newCoins })
        .eq("id", user.id);

}

const rewardBtn = document.getElementById("rewardBtn");
const rewardsPopup = document.getElementById("rewards-popup");
const closeRewards = document.getElementById("close-rewards");
const coinsDisplay = document.getElementById("coins-display");

rewardBtn.addEventListener("click", async () => {

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        authPopup.classList.remove("hidden");
        return;
    }

    const { data, error } = await supabaseClient
        .from("users")
        .select("coins")
        .eq("id", user.id)
        .single();

    if (!error) {
        coinsDisplay.textContent = `Coins: ${data?.coins || 0}`;
    }

    rewardsPopup.classList.remove("hidden");
});

closeRewards.addEventListener("click", () => {
    rewardsPopup.classList.add("hidden");
});
// ------------- LOAD ORDERS -------------
async function loadOrders() {
  if (!currentUser) {
    showAlert("Please login first");
    return;
  }

  const { data: orders, error } = await supabaseClient
    .from("orders")
    .select(`
      id,
      total_price,
      status,
      rated,
      created_at,
      total_cart,
      order_items (
        food_name,
        price,
        quantity
      )
    `)
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    return;
  }

  renderOrders(orders);
}

// ------------- RENDER ORDERS -------------
const ordersPopup = document.getElementById('orders-popup');
const closeOrders = document.getElementById('close-orders');

function renderOrders(orders) {

const ordersContainer = document.getElementById("orders-container");
ordersContainer.innerHTML = "";

if (!orders || orders.length === 0) {
ordersContainer.innerHTML = "<p>No orders yet</p>";
return;
}

orders.forEach(order => {

const date = new Date(order.created_at);

const timeString = date.toLocaleString(undefined,{
dateStyle:"medium",
timeStyle:"short"
});

let itemsHTML = "";   // ✅ FIX: define this first

order.order_items.forEach(item => {
  itemsHTML += `
  <div class="order-item">
    <span>${item.quantity}× ${item.food_name}</span>
    <span>₹${item.price * item.quantity}</span>
  </div>
  `;

});

let deliveryHTML = "";
if (order.delivery_charge && order.delivery_charge > 0) {
  deliveryHTML = `
    <div class="order-item">
      <span>Delivery Charge</span>
      <span>₹${order.delivery_charge}</span>
    </div>
  `;
}

const rateBtn =
order.status?.toLowerCase() === "delivered" && !order.rated
? `<button class="rate-order-btn" data-order="${order.id}">Rate Us</button>`
: "";

const div = document.createElement("div");
div.classList.add("order-card");

div.innerHTML = `
<div class="order-card-header">
  <div><b>Order ID:</b> ${order.id.slice(0,8)}</div>
  <div class="order-time">${timeString}</div>
</div>

<div class="order-items">
  ${itemsHTML}
  ${deliveryHTML}
</div>

<div class="order-total">Total: ₹${order.total_cart}</div>

<div class="order-status">
  Status: ${order.status || "Pending"}
</div>

${rateBtn}
`;

ordersContainer.appendChild(div);

});

}
// ------------- ORDERS POPUP -------------
function openOrders() {
  ordersPopup.classList.remove('hidden');
  loadOrders();
}

closeOrders.addEventListener('click', () => {
  ordersPopup.classList.add('hidden');
});

document.getElementById('orderBtn')?.addEventListener('click', openOrders);

// Dummy function: update your cart UI
function updaterCart() {
}

//cancel place order
cancelOrderBtn.addEventListener("click", () => {

    // hide order details popup
    orderDetailsPopup.classList.add("hidden");

    // optional: reopen cart
    cartPopup.classList.remove("hidden");

});



//open rating popup
const ratingPopup = document.getElementById("rating-popup")
const ratingItemsContainer = document.getElementById("rating-items")

document.addEventListener("click", async function(e){

const btn = e.target.closest(".rate-order-btn")

if(!btn) return

const orderId = btn.dataset.order
window.currentRatingOrderId = orderId;

const { data: items } = await supabaseClient
.from("order_items")
.select("*")
.eq("order_id", orderId)

ratingItemsContainer.innerHTML = ""

items.forEach(item=>{

const div = document.createElement("div")

div.classList.add("rating-item")

div.innerHTML = `
<span>${item.food_name}</span>

<div class="stars" data-food="${item.food_name}">
<span class="star">★</span>
<span class="star">★</span>
<span class="star">★</span>
<span class="star">★</span>
<span class="star">★</span>
</div>
`

ratingItemsContainer.appendChild(div)

})

ratingPopup.classList.remove("hidden")

})

//star selection logic
document.addEventListener("click", function(e){

const star = e.target.closest(".star")
if(!star) return

const starsContainer = star.parentElement
const stars = starsContainer.querySelectorAll(".star")

const index = [...stars].indexOf(star)

stars.forEach((s,i)=>{
if(i <= index){
s.classList.add("active")
}else{
s.classList.remove("active")
}
})
})

//submit rating
document.getElementById("submit-ratings")
.addEventListener("click", async () => {
  const ratingBlocks = document.querySelectorAll(".stars");

  for (const block of ratingBlocks) {
    const food = block.dataset.food;
    const stars = block.querySelectorAll(".star.active").length;

    await supabaseClient
      .from("food_ratings")
      .insert([{
        user_id: currentUser.id,
        food_name: food,
        rating: stars
      }]);
  }

  // Mark order as rated
  await supabaseClient
    .from("orders")
    .update({ rated: true })
    .eq("id", window.currentRatingOrderId);

  // Hide rating popup
  ratingPopup.classList.add("hidden");

  // Show "Thanks" popup
  const successPopup = document.getElementById("rating-success-popup");
  successPopup.classList.remove("hidden");

  // Remove the Rate Us button immediately
  const rateBtn = document.querySelector(`.rate-order-btn[data-order="${window.currentRatingOrderId}"]`);
  if(rateBtn) rateBtn.remove();
});

//thanks rating closing btn
document.getElementById("rating-success-ok").addEventListener("click", () => {
  document.getElementById("rating-success-popup").classList.add("hidden");
});

//close rating popup
document.getElementById("close-rating")
.addEventListener("click", () => {
ratingPopup.classList.add("hidden")
});

//sorting
function sortMenuItems(order) {
    const activeGroup = document.querySelector(".menu-group.active");
    if (!activeGroup) return;

    const cards = Array.from(activeGroup.querySelectorAll(".menu-card"));

    cards.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);

        return order === "low" ? priceA - priceB : priceB - priceA;
    });

    // Re-append sorted cards
    activeGroup.innerHTML = "";
    cards.forEach(card => activeGroup.appendChild(card));
}

document.getElementById("sort-select").addEventListener("change", function () {
    const value = this.value;

    if (value === "low-high") {
        sortMenuItems("low");
    } 
    else if (value === "high-low") {
        sortMenuItems("high");
    } 
    else {
        location.reload(); // quick reset (or re-render items properly)
    }
});

//load rewards
document.addEventListener("DOMContentLoaded", () => {
async function loadRewards() {
    const { data: rewards } = await supabaseClient
        .from("rewards")
        .select("*");

    const { data: claimed } = await supabaseClient
        .from("claimed_rewards")
        .select("*")
        .eq("user_id", currentUser?.id);

    const claimedIds = claimed?.map(c => c.reward_id) || [];

    const container = document.getElementById("rewards-container");
    container.innerHTML = "";

    rewards.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("reward-card");

        // Create button element
        const btn = document.createElement("button");
        btn.dataset.rewardId = item.id;
        btn.dataset.rewardName = item.name;
        btn.dataset.coinsRequired = item.coins_required;

        if (claimedIds.includes(item.id)) {
            btn.innerText = "Add to Cart";
            btn.onclick = () => addRewardToCart(item.name); // ✅ Set Add to Cart function
        } else {
            btn.innerText = "Claim";
            btn.onclick = () => claimReward(item.id, item.coins_required, item.name, btn);
        }

        div.innerHTML = `
            <img src="${item.image}" id="rewardImg">
            <h3 id="rewardName">${item.name}</h3>
            <p id="rewardCoinR">🪙 ${item.coins_required} Coins</p>
        `;

        div.appendChild(btn);
        container.appendChild(div);
        btn.dataset.rewardName = item.name;
    });
}
loadRewards();
})

//claim rewards
async function claimReward(rewardId, coinsRequired, name, btnElement) {

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    // Get user coins
    let { data } = await supabaseClient
        .from("users")
        .select("coins")
        .eq("id", user.id)
        .single();

    if (data.coins < coinsRequired) {
        showAlert("❌ Insufficient coins");
        return;
    }

    // Deduct coins
    await supabaseClient
        .from("users")
        .update({ coins: data.coins - coinsRequired })
        .eq("id", user.id);

    // Save claimed reward
    await supabaseClient
        .from("claimed_rewards")
        .insert({
            user_id: user.id,
            reward_id: rewardId
        });


    // ✅ Change button → Add to Cart
    btnElement.innerText = "Add to Cart";

    btnElement.onclick = () => addRewardToCart(name);
}

//reward add to cart
function addRewardToCart(name,btnElement) {
    const existing = cart.find(i => i.name === name && i.isReward);
    if (existing) return;
    const item = {
        name: name,
        price: 0,
        qty: 1,
        isReward: true
    };

    cart.push(item);
    updateCart();


    // Reset button back to Claim
    const rewardBtn = document.querySelector(`button[data-reward-name="${name}"]`);
    if (rewardBtn) rewardBtn.disabled = true;
}

//reset rewards 
function resetRewardButtons() {
    document.querySelectorAll(".reward-card button").forEach(btn => {
        if (btn.innerText === "Add to Cart") {
            btn.innerText = "Claim";
            btn.onclick = (e) => {
                const name = btn.dataset.rewardName;
                const id = btn.dataset.rewardId;
                const coins = btn.dataset.coinsRequired;
                claimReward(id, coins, name, btn);
            };
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {

    const contactLink = document.getElementById("contact-link");
    const contactSection = document.getElementById("contact-section");
    const backBtn = document.getElementById("back-from-contact");
    const pageContent = document.getElementById("page-content"); // ✅ FIX

    // Open Contact Section
    contactLink.addEventListener("click", () => {
        pageContent.classList.add("hidden");
        contactSection.classList.remove("hidden");
    });

    // Go Back
    backBtn.addEventListener("click", () => {
        contactSection.classList.add("hidden");
        pageContent.classList.remove("hidden");
        document.querySelector(".navbar").style.display = "flex";
    });

    // ===============================
// CHAT SYSTEM (FIXED)
// ===============================

const chatBtn = document.getElementById("chat-btn");
const chatPopup = document.getElementById("chat-popup");
const closeChat = document.getElementById("close-chat");

const chatMessages = document.getElementById("chat-messages");
const chatOptions = document.getElementById("chat-options");

// OPEN CHAT
chatBtn.addEventListener("click", async () => {
  chatPopup.classList.remove("hidden");

  // Ensure user is loaded
  const { data: { user } } = await supabaseClient.auth.getUser();
  currentUser = user;

  if (!currentUser) {
    addBotMessage("Please login first 🙏");
    return;
  }

  startChat();
});

closeChat.addEventListener("click", () => {
  chatPopup.classList.add("hidden");
});

// ===============================
// UI HELPERS
// ===============================

function addBotMessage(text) {
  const div = document.createElement("div");
  div.className = "bot";
  div.textContent = text;
  chatMessages.appendChild(div);
}

function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "user";
  div.textContent = text;
  chatMessages.appendChild(div);
}

function clearOptions() {
  chatOptions.innerHTML = "";
}

function addOption(text, callback) {
  const btn = document.createElement("button");
  btn.className = "option-btn";
  btn.textContent = text;
  btn.onclick = callback;
  chatOptions.appendChild(btn);
}

// ===============================
// START CHAT
// ===============================

function startChat() {
  chatMessages.innerHTML = "";
  clearOptions();

  addBotMessage("Hi 👋 How can I help you?");

  addOption("📦 I have not received my order", handleNotReceived);
  addOption("❌ Item missing in my order", handleMissingItem);
}

// ===============================
// CASE 1: NOT RECEIVED ORDER
// ===============================

async function handleNotReceived() {
  addUserMessage("I have not received my order");
  clearOptions();

  addBotMessage("Fetching your orders...");

  const { data: orders, error } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("user_id", currentUser.id);

  if (error) {
    addBotMessage("Error fetching orders ❌");
    return startChat();
  }

  if (!orders || orders.length === 0) {
    addBotMessage("No orders found.");
    return startChat();
  }

  // Filter pending/processing
  const activeOrders = orders.filter(o =>
    ["pending", "processing"].includes((o.status || "").toLowerCase())
  );

  if (activeOrders.length === 0) {
    addBotMessage("No active orders found.");
    return startChat();
  }

  addBotMessage("Select your order:");

  activeOrders.forEach(order => {
    addOption(
      `Order ₹${order.total_cart}`,
      () => checkLateOrder(order)
    );
  });
}

// CHECK DELAY
async function checkLateOrder(order) {
  addUserMessage(`Order ₹${order.total_cart}`);

  const orderTime = new Date(order.created_at);
  const now = new Date();

  const diffMinutes = (now - orderTime) / (1000 * 60);

if (diffMinutes > 60) {
  addBotMessage("Sorry 😔 Your order is delayed. Issue raised!");

  await createSupportTicket({
  order,
  issueType: "late_order"
});

} else {
  addBotMessage("Your order is on the way 🚚");
}

// ✅ CHANGE HERE
showMainOptions();
}

// ===============================
// CASE 2: MISSING ITEM
// ===============================

async function handleMissingItem() {
  addUserMessage("Item missing in my order");
  clearOptions();

  addBotMessage("Fetching delivered orders...");

  const { data: orders, error } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("user_id", currentUser.id);

  if (error || !orders) {
    addBotMessage("Error loading orders ❌");
    return startChat();
  }

  const deliveredOrders = orders.filter(o =>
    (o.status || "").toLowerCase() === "delivered"
  );

  if (deliveredOrders.length === 0) {
    addBotMessage("No delivered orders found.");
    return startChat();
  }

  addBotMessage("Select your order:");

  deliveredOrders.forEach(order => {
    addOption(
      `Order ₹${order.total_cart}`,
      () => loadOrderItems(order)
    );
  });
}

// LOAD ITEMS
async function loadOrderItems(order) {
  addUserMessage(`Order ₹${order.total_cart}`);
  clearOptions();

  addBotMessage("Fetching items...");

  const { data: items, error } = await supabaseClient
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  if (error || !items) {
    addBotMessage("Error fetching items ❌");
    return startChat();
  }

  addBotMessage("Which item is missing?");

  items.forEach(item => {
    addOption(
      item.food_name,
      () => reportMissingItem(order, item)
    );
  });
}

// REPORT MISSING ITEM
async function reportMissingItem(order, item) {
  addUserMessage(item.food_name);

await createSupportTicket({
  order,
  issueType: "missing_item",
  missingItem: item.food_name
});
  addBotMessage("Sorry 😔 Issue reported. We'll contact you soon!");

  showMainOptions();
}
function showMainOptions() {
  addBotMessage("How else can I help you?");

  clearOptions();

  addOption("📦 I have not received my order", handleNotReceived);
  addOption("❌ Item missing in my order", handleMissingItem);
}
//support ticket
async function createSupportTicket({ order, issueType, missingItem = null }) {

  // Get address
  const { data: addressData } = await supabaseClient
    .from("user_addresses")
    .select("*")
    .eq("id", order.address_id)
    .single();

  const addressText = addressData
    ? `${addressData.building}, ${addressData.street || ""}, ${addressData.city} - ${addressData.pincode}`
    : "No address";

  const phone = addressData?.phone || "No phone";

  // Get order items
  const { data: items } = await supabaseClient
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  // Insert ticket
  const { error } = await supabaseClient
    .from("support_tickets")
    .insert([{
      user_id: currentUser.id,
      order_id: order.id,
      issue_type: issueType,
      phone: phone,
      address: addressText,
      missing_item: missingItem,
      order_details: items
    }]);

  if (error) {
  }
}
});

//contact
const form = document.getElementById("contact-form");
const statusMsg = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      form.reset();
      statusMsg.classList.remove("hidden");
      statusMsg.textContent = "✅ Message Sent Successfully!";
    } else {
      statusMsg.classList.remove("hidden");
      statusMsg.textContent = "❌ Failed to send message.";
    }

  } catch (error) {
    statusMsg.classList.remove("hidden");
    statusMsg.textContent = "⚠️ Error sending message.";
  }
});

//random menu
async function loadRandomMenu() {
    const { data: menuItems, error } = await supabaseClient
        .from("menu-content")
        .select("*");

    if (error) {
        return;
    }

    const container = document.getElementById("random-menu-container");
    container.innerHTML = ""; // clear previous items

    // Shuffle the array randomly
    const shuffled = menuItems.sort(() => 0.5 - Math.random());

    // Take only the first 18 items
    const itemsToShow = shuffled.slice(0, 18);

    itemsToShow.forEach(food => {
        const card = document.createElement("div");
        card.classList.add("menu-card");
        card.dataset.name = food.name;
        card.dataset.price = food.price;
        card.dataset.img = food.image;
        card.dataset.desc = food.desc;

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <h4>${food.name}</h4>
            <div class="food-rating">★ ${food.rating || "4.5"}</div>
            <p class="price">₹${food.price}</p>
            <button class="add-cart-btn">
                <i class="fa-solid fa-plus"></i>
            </button>
        `;

        // Add click events for popup and add-to-cart
        card.querySelector(".add-cart-btn").addEventListener("click", e => {
            e.stopPropagation();
            addToCart(food.name, food.price);
            showToast("Item added to cart 🛒");
        });

        card.addEventListener("click", () => openFoodPopup(card));

        container.appendChild(card);
    });
}
// Call it on page load
document.addEventListener("DOMContentLoaded", loadRandomMenu);


//close profile menu when clicked anywhere else

// Prevent clicks inside menu from closing it
profileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
});

// Close menu when clicking anywhere else
document.addEventListener("click", () => {
    profileMenu.classList.add("hidden");
});


//no search bar in the full menu section in mobile view
const fullMenu = document.getElementById("full-menu-section");
const mobileSearchBar = document.getElementById("mobileSearch");


// Open menu
fullMenuBtn.addEventListener("click", () => {
    fullMenu.classList.remove("hidden");
    fullMenu.classList.add("active");

    if (window.innerWidth <= 768) {
        mobileSearchBar.classList.add("hide-mobile-search");
    }
});

// Close menu
closeMenuBtn.addEventListener("click", () => {
    fullMenu.classList.add("hidden");
    fullMenu.classList.remove("active");

    mobileSearchBar.classList.remove("hide-mobile-search");
});


//mobile bottom nav
// MOBILE NAV ACTIONS

// Orders
document.getElementById("mobile-orders").addEventListener("click", async () => {
    document.getElementById("orders-popup").classList.remove("hidden");

    // ✅ IMPORTANT: load orders
    if (currentUser) {
        await loadOrders();
    }
});
// Rewards
document.getElementById("mobile-rewards").addEventListener("click", async () => {
  
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        authPopup.classList.remove("hidden");
        return;
    }

    const { data, error } = await supabaseClient
        .from("users")
        .select("coins")
        .eq("id", user.id)
        .single();

    if (!error) {
        coinsDisplay.textContent = `Coins: ${data?.coins || 0}`;
    }

    document.getElementById("rewards-popup").classList.remove("hidden");
    
});

// Contact

      // OPEN CONTACT
    document.getElementById("mobile-contact").addEventListener("click", () => {
    document.getElementById("page-content").classList.add("hidden");
    document.getElementById("contact-section").classList.remove("hidden");

    document.querySelector(".navbar").style.display = "none";
    document.body.classList.add("hide-search");
});

// BACK
document.getElementById("back-from-contact").addEventListener("click", () => {
    document.body.classList.remove("hide-search");
});


//global alert
function showAlert(message) {
    const popup = document.getElementById("custom-alert");
    const msg = document.getElementById("alert-message");

    msg.textContent = message;
    popup.classList.remove("hidden");
}

document.getElementById("alert-ok").addEventListener("click", () => {
    document.getElementById("custom-alert").classList.add("hidden");
});
