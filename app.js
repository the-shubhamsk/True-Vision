// app.js
const fileInput = document.getElementById("imageInput");
const imageContainer = document.querySelector(".imageUploaded");
const img = document.createElement("img");
const fileText = document.querySelector(".fileText");

fileInput.addEventListener("change", getFile);

function getFile(e) {
  const fileItem = e.target.files[0];
  const fileName = fileItem.name;
  fileText.innerHTML = fileName;
}

function uploadImage() {
  console.log('uploadImage function called');  // Ensure this line is reached
  const fileItem = fileInput.files[0];
  const fileName = fileItem.name;

  const storageRef = firebase.storage().ref("images/" + fileName);
  const uploadTask = storageRef.put(fileItem);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percentVal = Math.floor(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(percentVal);
    },
    (error) => {
      console.log("Error is ", error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((url) => {
        console.log("URL", url);

        if (url !== "") {
          img.setAttribute("src", url);
          img.setAttribute("alt", "Uploaded Image");
          img.style.border = "5px solid cornflowerblue";
          imageContainer.innerHTML = ''; // Clear previous content
          imageContainer.appendChild(img);
        }
      });
    }
  );
}

// Make the uploadImage function globally accessible
window.uploadImage = uploadImage;


// app.js

document.addEventListener("DOMContentLoaded", function () {
  const imageGallery = document.getElementById("imageGallery");
  const imageInterval = 2000; // Change this value to adjust the interval in milliseconds

  function displayAllImages() {
    const storageRef = firebase.storage().ref();

    storageRef.child('images').listAll().then((result) => {
      const imageUrls = [];

      result.items.forEach((itemRef) => {
        itemRef.getDownloadURL().then((url) => {
          imageUrls.push(url);
        }).catch((error) => {
          console.error('Error getting download URL:', error);
        });
      });

      // Start auto-scrolling
      let currentIndex = 0;

      setInterval(() => {
        const imageUrl = imageUrls[currentIndex];

        if (imageUrl) {
          const imageContainer = document.createElement('div');
          imageContainer.classList.add('image-container');

          const image = document.createElement('img');
          image.src = imageUrl;
          image.alt = 'Firebase Image';
          image.classList.add('firebase-image');

          // Append the image to the container
          imageContainer.appendChild(image);

          // Clear previous content and append the new image container
          imageGallery.innerHTML = '';
          imageGallery.appendChild(imageContainer);

          // Increment index or reset to 0 if it reaches the end
          currentIndex = (currentIndex + 1) % imageUrls.length;
        }
      }, imageInterval);
    }).catch((error) => {
      console.error('Error listing items in images folder:', error);
    });
  }

  // Call the function to display all images
  displayAllImages();
});

