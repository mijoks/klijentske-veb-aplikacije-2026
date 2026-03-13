import Swal from "sweetalert2";

export const matCustomClass = {
    popup: 'mat-swal-popup',
    title: 'mat-swal-title',
    htmlContainer: 'mat-swal-text',
    confirmButton: 'mat-swal-confirm',
    cancelButton: 'mat-swal-cancel',
    actions: 'mat-swal-actions'
}

// Konfiguracija za male "Toast" poruke koje se same gase
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    customClass: matCustomClass
});

export class Alerts {
    static success(text: string) {
        Toast.fire({
            icon: 'success',
            title: text
        });
    }

    static error(text: string) {
        Toast.fire({
            icon: 'error',
            title: text
        });
    }

    static async confirm(text: string, callback: Function) {
        const result = await Swal.fire({
            title: "Da li ste sigurni?",
            text: text,
            icon: "warning", // Warning ikonica je prirodnija za potvrdu
            showCancelButton: true,
            confirmButtonText: "Potvrdi",
            cancelButtonText: "Odustani",
            heightAuto: false, // Sprečava skakanje stranice
            customClass: matCustomClass,
            buttonsStyling: false // Gasimo default stilove da bi naš CSS radio
        });

        if (result.isConfirmed) {
            await callback();
        }
    }
}