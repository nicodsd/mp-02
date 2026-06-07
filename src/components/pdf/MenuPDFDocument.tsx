import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333333",
  },
  categoryTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingBottom: 5,
    color: "#555555",
    fontWeight: "bold",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%", // Two columns
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 3,
    marginBottom: 8,
  },
  dishName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222222",
  },
  description: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 8,
    flexGrow: 1,
  },
  priceRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  price: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111111",
  },
  promoPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#e28743",
  },
  originalPrice: {
    fontSize: 10,
    textDecoration: "line-through",
    color: "#999999",
    marginLeft: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#aaaaaa",
  },
});

type Food = {
  _id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sub_category: string;
  is_gluten_free?: boolean;
  is_promo?: boolean;
  promo_price?: number;
};

interface MenuPDFDocumentProps {
  foods: Food[];
  restaurantName: string;
  pageSize: "A4" | "LETTER" | "LEGAL";
}

// Lógica de partición
const chunkArray = (array: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const MenuPDFDocument: React.FC<MenuPDFDocumentProps> = ({
  foods,
  restaurantName,
  pageSize = "A4",
}) => {
  // 1. Group foods by category
  const groupedFoods: Record<string, Food[]> = {};
  foods.forEach((food) => {
    const cat = food.sub_category || "Otros";
    if (!groupedFoods[cat]) groupedFoods[cat] = [];
    groupedFoods[cat].push(food);
  });

  // Calculate proportional chunks if a category has too many items.
  // Un tamaño A4 cómodo para 2 columnas con imagen de 120px es de aprox 6-8 ítems por página (3-4 filas).
  // Si dividimos proporcionalmente, calculamos el total y las páginas necesarias.
  
  const MAX_ITEMS_PER_PAGE = 8; 

  return (
    <Document>
      {Object.entries(groupedFoods).map(([category, items]) => {
        // Determinamos cuántas páginas requiere esta categoría para ser proporcional
        const numPages = Math.ceil(items.length / MAX_ITEMS_PER_PAGE);
        const itemsPerPage = Math.ceil(items.length / numPages); // Reparto proporcional
        
        const pages = chunkArray(items, itemsPerPage);

        return pages.map((pageItems, pageIndex) => (
          <Page
            key={`${category}-${pageIndex}`}
            size={pageSize}
            style={styles.page}
          >
            {pageIndex === 0 && (
              <Text style={styles.header}>{restaurantName}</Text>
            )}

            <Text style={styles.categoryTitle}>
              {category} {pages.length > 1 ? `(${pageIndex + 1}/${pages.length})` : ""}
            </Text>

            <View style={styles.grid}>
              {pageItems.map((food) => (
                <View key={food._id} style={styles.card}>
                  {food.photo ? (
                    <Image style={styles.image} src={food.photo} />
                  ) : null}
                  <Text style={styles.dishName}>{food.name}</Text>
                  <Text style={styles.description}>
                    {food.description || ""}
                  </Text>
                  
                  <View style={styles.priceRow}>
                    {food.is_promo && food.promo_price ? (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.promoPrice}>
                          ${food.promo_price}
                        </Text>
                        <Text style={styles.originalPrice}>${food.price}</Text>
                      </View>
                    ) : (
                      <Text style={styles.price}>${food.price}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            <Text
              style={styles.footer}
              render={({ pageNumber, totalPages }) =>
                `${restaurantName} - Página ${pageNumber} de ${totalPages}`
              }
              fixed
            />
          </Page>
        ));
      })}
    </Document>
  );
};

export default MenuPDFDocument;
