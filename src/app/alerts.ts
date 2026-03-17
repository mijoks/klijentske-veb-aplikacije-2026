import Swal from "sweetalert2";

export const matCustomClass = {
    popup: 'mat-swal-popup',
    title: 'mat-swal-title',
    htmlContainer: 'mat-swal-text',
    confirmButton: 'mat-swal-confirm',
    cancelButton: 'mat-swal-cancel',
    actions: 'mat-swal-actions'
}

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
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Potvrdi",
            cancelButtonText: "Odustani",
            heightAuto: false, 
            customClass: matCustomClass,
            buttonsStyling: false 
        });

        if (result.isConfirmed) {
            await callback();
        }
    }
}