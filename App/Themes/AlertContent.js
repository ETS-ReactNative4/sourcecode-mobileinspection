import {Images} from '../Themes'

const alert = {
    'email_kosong': { showModal: true, title: 'Email Kosong', message: 'Kamu harus isi email terlebih dahulu', icon: Images.img_input_tidak_lengkap },
    'password_kosong': { showModal: true, title: 'Password Kosong', message: 'Kamu harus isi password terlebih dahulu', icon: Images.img_input_tidak_lengkap },
    'no_internet': { showModal: true, title: 'Tidak Ada Koneksi', message: 'Opps, check koneksi internet mu dulu ya', icon: Images.img_no_internet },
    'proses_lambat': { showModal: true, title: 'Proses Sedang Lambat', message: 'Silahkan Kamu Coba Lagi', icon: Images.img_no_internet },
    'email_pass_salah': { showModal: true, title: 'Username & Password', message: 'Username atau Password Kamu salah nih.. coba check ulang ya', icon: Images.img_pass_salah },
    'ambil_photo': { showModal: true, title: "Ambil Foto", message: 'Opps kamu harus foto bukti kerja dulu yaaa', icon: Images.ic_no_pic },
    'temuan': { showModal: true, title: "Temuan", message: 'Kamu tidak bisa memproses temuan ini', icon: Images.ic_progress },
    'temuan1': { showModal: true, title: 'Temuan', message: 'Selesaikan Progress temuan kamu dulu yaa', icon: Images.ic_progress },
    'batas_waktu': { showModal: true, title: "Batas Waktu", message: 'Kamu harus tentukan batas waktu temuan dulu', icon: Images.ic_batas_waktu },
    'update_temuan': { showModalBack: true, title: 'Update Temuan', message: 'Data Temuan kamu sudah diupdate yaa..', icon: Images.ic_save_berhasil },
    'foto_gagal': { showModal: true, title: 'Pengambilan Foto Gagal', message: 'Lakukan pengambilan foto lagi', icon: Images.ic_ambil_foto_gagal },
    'no_data_map': { fetchLocation: false, showModal: true, title: 'Tidak ada data', message: "Kamu belum download data map", icon: Images.ic_blm_input_lokasi },
    'no_location': { fetchLocation: false, showModal: true, title: 'Tidak ada lokasi', message: "Kamu belum pilih lokasi kamu", icon: Images.ic_blm_input_lokasi },
}

export default alert;
