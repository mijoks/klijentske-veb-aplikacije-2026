import { UserModel } from "../models/user.model"
import { ToyModel } from "../models/toy.model"
import { OrderModel } from "../models/order.model"

const USERS = 'users'
const ACTIVE = 'active'

export class AuthService {
    static getUsers(): UserModel[] {
        const baseUser: UserModel = {
            email: 'user@example.com',
            password: 'user123',
            toy: 'Drvena slagalica životinje',
            firstName: 'Example',
            lastName: 'User',
            phone: '0653093267',
            address: 'Danijelova 32',
            toys: []

        }
        if (localStorage.getItem(USERS) == null) {
            localStorage.setItem(USERS, JSON.stringify([baseUser]))
        }

        return JSON.parse(localStorage.getItem(USERS)!)

    }
    static login(email: string, password: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === email && u.password === password) {
                localStorage.setItem(ACTIVE, email)
                return true
            }
        }

        return false
    }
    static getActiveUser(): UserModel | null {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                return u
            }
        }

        return null
    }
    static updateActiveUser(newUserData: UserModel) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.firstName = newUserData.firstName
                u.lastName = newUserData.lastName
                u.address = newUserData.address
                u.phone = newUserData.phone
                u.toys = newUserData.toys
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }
    static updateActiveUserPassword(newPassword: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.password = newPassword
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }
    static logout() {
        localStorage.removeItem(ACTIVE)
    }
    static createUser(user: Partial<UserModel>) {
        const users = this.getUsers()
        user.toys = []
        users.push(user as UserModel)
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static existsByEmail(email: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === email) return true
        }

        return false
    }
    static getOrdersByState(state: 'r' | 'p' | 'o'): OrderModel[] {
        const user = this.getActiveUser();

        // Proveravamo da li user postoji i da li ima niz igračaka
        if (!user || !user.toys) {
            return [];
        }

        // Eksplicitno kažemo TypeScript-u da je user.toys zapravo niz OrderModel-a
        const orders = user.toys as OrderModel[];

        // Sada će prepoznati .status bez greške
        return orders.filter(order => order.status === state);
    }
    static payOrders() {
        const user = this.getActiveUser();

        if (user && user.toys) {
            const updatedToys = (user.toys as OrderModel[]).map(toy => {
                if (toy.status === 'r') {
                    return { ...toy, status: 'p' as const };
                }
                return toy;
            });

            // Ovde dodaj 'as any' da TypeScript prestane da se žali na prazan niz
            user.toys = updatedToys as any;

            this.updateActiveUser(user);
        }
    }
    static cancelOrder(createdAt: number) {
    const user = this.getActiveUser();

    if (user && user.toys) {
        // Zadržavamo sve igračke OSIM one koja ima prosleđeni createdAt
        const updatedToys = (user.toys as OrderModel[]).filter(toy => toy.createdAt !== createdAt);
        
        // Ponovo koristimo 'as any' ako ti TypeScript i dalje pravi problem sa [] tipom
        user.toys = updatedToys as any;

        // Snimamo promene u localStorage
        this.updateActiveUser(user);
    }
}
}






