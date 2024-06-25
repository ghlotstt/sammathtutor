function describeImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    return fetch("/describe_image", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.description) {
            return data.description;
        } else {
            throw new Error("Failed to get image description");
        }
    })
    .catch(error => {
        console.error("Error describing image:", error);
        return "I'm sorry, but I couldn't describe the image.";
    });
}
