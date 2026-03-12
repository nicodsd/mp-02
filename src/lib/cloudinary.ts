export const getOptimizedImage = (url: string, width = 400, height = 400) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    // c_fill (recorte), g_face (centrar en cara si es perfil), w_ (ancho), q_auto (calidad automática)
    const transformation = `c_fill,g_face,w_${width},h_${height},q_auto,f_auto`;

    return url.replace("/upload/", `/upload/${transformation}/`);
};

export const getBannerImage = (url: string) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    // Para banners usamos un ancho mayor y recorte horizontal
    const transformation = `c_fill,w_1200,h_400,g_center,q_auto,f_auto`;
    return url.replace("/upload/", `/upload/${transformation}/`);
};