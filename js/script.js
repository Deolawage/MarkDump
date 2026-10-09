
const AFRIBASE_URL = "https://cxhk6b8xxxk041p1cpga.afribase.dev/rest/v1";
const AFRIBASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIxMDY1NzQ3NjAsImlhdCI6MTc5MTIxNDc2MCwiaXNzIjoiNWNmMjc1YmYtODhjOS00NjYwLTllMzEtMzY0ZmRhNWZhMzg4Iiwicm9sZSI6ImFub24ifQ.7VPmv7yI9F3yrNo3_UCV6adMxNmzMaxRv4rujC-BwSA";


class Product {
    constructor(name, description, price, category, images, location, quantity) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.price = Number(price);
        this.category = category;
        this.images = images;
        this.seller = null;
        this.location = location;
        this.quantity = Number(quantity);
        this.createdAt = new Date();
        this.status = "active";
    }
}

class ProductManager {
    async addProduct(product) {
        return await ProductStore.addProduct(product);
    }

    getProducts() {
        return ProductStore.getProducts();
    }

    async getProductsByCategory(category) {
        const products = await ProductStore.getProducts();

        return products.filter(
            (product) => product.category === category);
    }

    async getProductById(productId) {
        const products = await ProductStore.getProducts();
    
       return products.find(
        (product) => product.id === productId);
    }

    async searchProducts(searchTerm) {
        const products =  await ProductStore.getProducts();
    

        return products.filter(
            (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    }
}


const productManager = new ProductManager();

const ProductStore = (() => {

    async function addProduct(product) {
        const response = await fetch(`${AFRIBASE_URL}/products`, {
            method: "POST",
            headers: {
                apikey: AFRIBASE_PUBLIC_KEY,
                Authorization: `Bearer ${AFRIBASE_PUBLIC_KEY}`,
                "Content-Type": "application/json",
                Prefer: "return=representation"
            },
            body: JSON.stringify({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                quantity: product.quantity,
                images: product.images,
                seller_name: product.seller,
                location: product.location,
                status: product.status
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to save product: ${JSON.stringify(error)}`);
        }

        const [savedProduct] = await response.json();

        return savedProduct;
    }

    async function getProducts() {
        const response = await fetch(
            `${AFRIBASE_URL}/products?select=*&status=eq.active&order=created_at.desc`,
            {
                headers: {
                    apikey: AFRIBASE_PUBLIC_KEY,
                    Authorization: `Bearer ${AFRIBASE_PUBLIC_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }

        return await response.json();
    }

    return {
        addProduct,
        getProducts
    };

})();

const WishlistStore = (()=>{

    let wishlist = [];

    function addProduct(productId) {
        wishlist.push(productId);
    }

    function removeProduct(productId) {
        wishlist = wishlist.filter((id) => id !== productId);
    }

    function isInWishlist(productId) {
        return wishlist.includes(productId);
    }
    



    function getWishlist() {
        return wishlist;
    }

    return{
        addProduct,
        removeProduct,
        isInWishlist,
        getWishlist
    }
    
})();


const CartStore = (() => {

    let cart = [];

    function addProduct(productId) {
        cart.push(productId);
    }

    function removeProduct(productId) {
        cart = cart.filter((id) => id !== productId);
    }

    function getCart() {
        return cart;
    }

    function isInCart(productId){
     return cart.includes(productId);
    }

    return{
        addProduct,
        removeProduct,
        getCart,
        isInCart
    };
    
})();



// Sell input form


const SellController = (() => {

    const sellBtn = document.getElementById("sell-btn");
    const sellModal = document.getElementById("sell-modal");
    const sellCloseBtn = document.querySelector(".sell-modal-close");
    const sellForm = document.getElementById("sell-form");

    const productImages = document.querySelector("#product-images");
    const imagePreview = document.querySelector("#image-preview");






    function resetForm() {
        sellForm.reset();
        imagePreview.replaceChildren();
    }


    function openModal() {
        sellModal.style.display = "flex";
    }


    function closeModal() {
        sellModal.style.display = "none";
        resetForm();
    }


    sellBtn.addEventListener("click", (e) => {
        openModal();
    });


    sellCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
    });


    sellModal.addEventListener("click", (e) => {
        if (e.target === sellModal) {
            closeModal();
        }
    });


    productImages.addEventListener("change", () => {

        const files = Array.from(productImages.files);

        imagePreview.replaceChildren();

        files.forEach((file, index) => {

            const previewItem = document.createElement("div");
            previewItem.classList.add("image-preview-item");

            const image = document.createElement("img");
            image.src = URL.createObjectURL(file);
            image.alt = "Product preview";

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.classList.add("image-preview-remove");

            const closeIcon = document.createElement("img");
            closeIcon.src = "assets/Icons/close.svg";
            closeIcon.alt = "Remove image";

            removeButton.appendChild(closeIcon);

            removeButton.addEventListener("click", () => {

                files.splice(index, 1);

                const dataTransfer = new DataTransfer();

                files.forEach((file) => {
                    dataTransfer.items.add(file);
                });

                productImages.files = dataTransfer.files;

                previewItem.remove();
            });

            previewItem.appendChild(image);
            previewItem.appendChild(removeButton);

            imagePreview.appendChild(previewItem);
        });
    });




sellForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const productName = document.querySelector("#product-name").value;
    const productDescription = document.querySelector("#product-description").value;
    const productPrice = document.querySelector("#product-price").value;
    const productQuantity = document.querySelector("#product-quantity").value;
    const productCategory = document.querySelector("#product-category").value;
    const productLocation = document.querySelector("#product-location").value;
    const productFiles = document.querySelector("#product-images").files;

    const imageData = Array.from(productFiles).map((file) => {
        return URL.createObjectURL(file);
    });

    const product = new Product(
        productName,
        productDescription,
        productPrice,
        productCategory,
        imageData,
        productLocation,
        productQuantity
    );

    productManager.addProduct(product);

    DisplayController.renderProducts();

    closeModal();
});



    return {
        closeModal
    };

})();

const productGrid = document.querySelector(".product-grid");

const DisplayController = (() => {

    function renderProducts(products = productManager.getProducts()) {
        productGrid.replaceChildren();

        products.forEach((product) => {
 
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
        


            productCard.dataset.productId = product.id;

            const productImage = document.createElement("div");
            productImage.classList.add("product-image");

            const image = document.createElement("img");
            image.src = product.images[0];
            image.alt = product.name;

            const wishlistButton = document.createElement("button");
            wishlistButton.classList.add("wishlist-btn");
            wishlistButton.setAttribute("aria-label", "Add to wishlist");

           if (WishlistStore.isInWishlist(product.id)) {
    wishlistButton.classList.add("is-wishlisted");
}



           const heartIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
);

heartIcon.setAttribute("viewBox", "0 0 24 24");
heartIcon.setAttribute("width", "24");
heartIcon.setAttribute("height", "24");
heartIcon.setAttribute("fill", "none");
heartIcon.setAttribute("stroke", "currentColor");
heartIcon.setAttribute("stroke-width", "2");
heartIcon.setAttribute("stroke-linecap", "round");
heartIcon.setAttribute("stroke-linejoin", "round");

const heartPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
);

heartPath.setAttribute(
    "d",
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
);

heartIcon.appendChild(heartPath);

            wishlistButton.appendChild(heartIcon);
         wishlistButton.addEventListener("click", (e) => {
            e.stopPropagation();

             if (WishlistStore.isInWishlist(product.id)) {
        WishlistStore.removeProduct(product.id);
    } else {
        WishlistStore.addProduct(product.id);
    }

     wishlistButton.classList.toggle(
    "is-wishlisted",
    WishlistStore.isInWishlist(product.id)
);
     console.log(WishlistStore.getWishlist());
         });
        

            productImage.appendChild(image);
            productImage.appendChild(wishlistButton);

            const productInfo = document.createElement("div");
            productInfo.classList.add("product-info");

            const category = document.createElement("p");
            category.classList.add("product-category");
            category.textContent = product.category;

            const name = document.createElement("h3");
            name.textContent = product.name;

            const seller = document.createElement("p");
            seller.classList.add("product-seller");
            seller.textContent = "Sold by Mark Seller";

            const price = document.createElement("p");
            price.classList.add("product-price");
            price.textContent = `₦${product.price.toLocaleString()}`;

            productInfo.appendChild(category);
            productInfo.appendChild(name);
            productInfo.appendChild(seller);
            productInfo.appendChild(price);

            productCard.appendChild(productImage);
            productCard.appendChild(productInfo);

            productGrid.appendChild(productCard);
        });
    }

    return {
        renderProducts
    };

})();

const SearchController = (() => {
    const searchForm = document.querySelector(".search-bar");
    const searchInput = searchForm.querySelector("input");

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const SearchTerm = searchInput.value.trim();

        if ( SearchTerm === "") {
            DisplayController.renderProducts();
            return;
        }

        const searchResults = productManager.searchProducts(SearchTerm);

        DisplayController.renderProducts(searchResults);
    });
})();





const ProductDetailController = (() => {

    const productGrid = document.querySelector(".product-grid");
    const productDetailModal = document.getElementById("product-detail-modal");
    const closeButton = document.querySelector(".product-detail-modal-close");
    const productDetailContent = document.querySelector(".product-detail-content");

    productGrid.addEventListener("click", (e) => {

        const productCard = e.target.closest(".product-card");

        if (!productCard) {
            return;
        }

        const productId = productCard.getAttribute("data-product-id");

        console.log("Product ID:", productId);

        const product = productManager.getProductById(productId);
        console.log("Product:", product);

productDetailContent.replaceChildren();

const productName = document.createElement("h2");
productName.textContent = product.name;

productDetailContent.appendChild(productName);


const productDescription = document.createElement("p");
productDescription.textContent = product.description;
productDetailContent.appendChild(productDescription);


const productPrice =document.createElement("p");
productPrice.textContent = `₦${product.price.toLocaleString()}`;
productDetailContent.appendChild(productPrice);


const productImage = document.createElement("img");
productImage.src = product.images[0];
productImage.alt = product.name;
productDetailContent.appendChild(productImage);


const productCategory = document.createElement("p");
productCategory.textContent = product.category;
productDetailContent.appendChild(productCategory);


const productSeller = document.createElement("p");
productSeller.textContent = product.seller ?? "Seller information unavailable";
productDetailContent.appendChild(productSeller);



const productLocation = document.createElement("p");
productLocation.textContent = `Location: ${product.location}`;
productDetailContent.appendChild(productLocation);

const productQuantity = document.createElement("p");
productQuantity.textContent = `Quantity: ${product.quantity}`;
productDetailContent.appendChild(productQuantity);

const addToCartButton = document.createElement("button");
addToCartButton.type = "button";
addToCartButton.textContent = CartStore.isInCart(product.id)
? "Added to Cart"
: "Add to Cart";

addToCartButton.classList.add("add-to-cart-btn");

addToCartButton.addEventListener("click", () => {
    if (CartStore.isInCart(product.id)) {
        return;
    }

    CartStore.addProduct(product.id);
    const cartCount = document.querySelector(".cart-count");
cartCount.textContent = CartStore.getCart().length;

    addToCartButton.textContent = "Added to Cart";
});

productDetailContent.appendChild(addToCartButton);


productDetailModal.style.display = "flex";

    });

    closeButton.addEventListener("click", () => {
        productDetailModal.style.display = "none";
    });

    productDetailModal.addEventListener("click", (e) => {
    if (e.target === productDetailModal) {
        productDetailModal.style.display = "none";
    }
});

})();



const CategoryController = (() => {
    const categoryCards = document.querySelectorAll(".category-card");
    const viewAllBtn =document.getElementById("view-all-products"); 

    categoryCards.forEach((card) => {
        card.addEventListener("click", (e) => {
            e.preventDefault();

            const category = card.dataset.category;

            const products = productManager.getProductsByCategory(category);

            DisplayController.renderProducts(products);

        });


    });

            viewAllBtn.addEventListener("click", (e) => {

    e.preventDefault();

    const products = productManager.getProducts();

     if (products.length === productGrid.children.length) {
        return;
    }

    DisplayController.renderProducts(products);
});


 

})();

