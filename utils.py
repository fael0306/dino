# Utilities for Image Handling in PaleoLab

def load_image(image_path):
    """Load an image from the specified path."""
    from PIL import Image
    return Image.open(image_path)


def save_image(image, save_path):
    """Save the given image to a specified path."""
    image.save(save_path)


def generate_silhouette(image):
    """Generate a silhouette from the given image."""
    import numpy as np
    from PIL import ImageOps
    gray_image = image.convert('L')
    silhouette = ImageOps.invert(gray_image)
    return silhouette


def visualize_comparison(original_image, processed_image):
    """Visualize the comparison between the original and processed images."""
    import matplotlib.pyplot as plt
    fig, axes = plt.subplots(1, 2)
    axes[0].imshow(original_image)
    axes[0].set_title('Original Image')
    axes[1].imshow(processed_image)
    axes[1].set_title('Processed Image')
    plt.show()


def scale_calculations(original_size, target_size):
    """Calculate scale factors for resizing images."""
    scale_x = target_size[0] / original_size[0]
    scale_y = target_size[1] / original_size[1]
    return scale_x, scale_y


# Additional helper functions can be added as needed.