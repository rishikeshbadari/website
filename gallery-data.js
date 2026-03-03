const GALLERY_COUNT = 77;
const galleryData = Array.from({ length: GALLERY_COUNT }, function(_, i) {
    return { src: "pictures/optimized/" + (i + 1) + ".jpg" };
});
