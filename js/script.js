
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
    addProduct(product) {
        ProductStore.addProduct(product);
    }

    getProducts() {
        return ProductStore.getProducts();
    }

    getProductsByCategory(category) {
        return ProductStore
        .getProducts()
        .filter((product) => product.category === category);
    }

    getProductById(productId) {
        return ProductStore
        .getProducts()
        .find((product) => product.id === productId);
    }
}


const productManager = new ProductManager();

const ProductStore = (() => {

 let products = [];

 function addProduct(product) {
        products.push(product);
    }

    function getProducts(){
        return products;
    }

    return {
        addProduct,
        getProducts
    }
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

            const heartIcon = document.createElement("img");
            heartIcon.src = "assets/Icons/heart.svg";
            heartIcon.alt = "";

            wishlistButton.appendChild(heartIcon);
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

productDetailModal.style.display = "flex";

    });

    closeButton.addEventListener("click", () => {
        productDetailModal.style.display = "none";
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

