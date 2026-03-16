export class DataService {
    static getToyTypes() {
        return [
            { id: 1, name: 'Slagalica', description: 'Logičke igre za sve uzraste' },
            { id: 2, name: 'Slikovnica', description: 'Edukativne ilustrovane knjige' },
            { id: 3, name: 'Figura', description: 'Akcione figure i kolekcionarski predmeti' },
            { id: 4, name: 'Karakter', description: 'Likovi iz crtanih filmova i igara' }
        ];
    }

    static getToyTypeById(id: number) {
        return this.getToyTypes().find(t => t.id === id) || this.getToyTypes()[0];
    }

    static getStatusText(status: 'r' | 'p' | 'o') {
        const statuses = {
            'r': 'Rezervisano',
            'p': 'Pristiglo',
            'o': 'Otkazano'
        };
        return statuses[status];
    }
    static getToyRating(toyId: string | number) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        let total = 0;
        let count = 0;

        const searchId = toyId?.toString();

        users.forEach((u: any) => {
            if (u.toys && Array.isArray(u.toys)) {
                u.toys.forEach((t: any) => {
                    if (t.toyId?.toString() === searchId && t.rating) {
                        total += Number(t.rating);
                        count++;
                    }
                });
            }
        });

        return {
            average: count > 0 ? (total / count).toFixed(1) : null,
            count: count
        };
    }
}