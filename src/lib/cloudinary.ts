export const getOptimizedImage = (url: string, width = 700, height = 700) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    // c_fill (recorte), g_face (centrar en cara si es perfil), w_ (ancho), q_auto (calidad automática)
    const transformation = `c_fill,g_face,w_${width},h_${height},q_100,f_auto`;

    return url.replace("/upload/", `/upload/${transformation}/`);
};

export const getBannerImage = (url: string) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    // Para banners usamos un ancho mayor y recorte horizontal
    const transformation = `c_fill,w_1400,h_700,g_center,q_auto,f_auto`;
    return url.replace("/upload/", `/upload/${transformation}/`);
};