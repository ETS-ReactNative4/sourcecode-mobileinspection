
import { Images } from '../Themes'

const alert = {
    'email_kosong': {
        showModal: true,
        title: 'Email Kosong',
        message: 'Kamu harus isi email terlebih dahulu',
        icon: Images.img_input_tidak_lengkap
    },
    'password_kosong': {
        showModal: true,
        title: 'Password Kosong',
        message: 'Kamu harus isi password terlebih dahulu',
        icon: Images.img_input_tidak_lengkap
    },
    'no_internet': {
        showModal: true,
        title: 'Tidak Ada Koneksi',
        message: 'Opps, check koneksi internet mu dulu ya',
        icon: Images.img_no_internet
    },
    'proses_lambat': {
        showModal: true,
        title: 'Proses Sedang Lambat',
        message: 'Silahkan Kamu Coba Lagi',
        icon: Images.img_no_internet
    },
    'email_pass_salah': {
        showModal: true,
        title: 'Username & Password',
        message: 'Username atau Password Kamu salah nih.. coba check ulang ya',
        icon: Images.img_pass_salah
    }
}

export default alert;
