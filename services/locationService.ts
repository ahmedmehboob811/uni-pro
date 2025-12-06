
export interface Coordinates {
    latitude: number;
    longitude: number;
}

export const locationService = {
    getCurrentPosition: (): Promise<Coordinates> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by your browser"));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }
        });
    },

    // Calculate distance between two points in km using Haversine formula
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return parseFloat(d.toFixed(1));
    },

    // Generate random coordinates near a specific point (for mock data)
    generateNearbyLocation: (centerLat: number, centerLng: number, radiusKm: number) => {
        const y0 = centerLat;
        const x0 = centerLng;
        const rd = radiusKm / 111300; // about 111300 meters in one degree

        const u = Math.random();
        const v = Math.random();

        const w = rd * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y = w * Math.sin(t);

        return {
            lat: y + y0,
            lng: x + x0
        };
    }
};

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}
