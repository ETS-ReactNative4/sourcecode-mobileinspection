
import { Images } from '../Themes'

const dataSuggestion = {
    listSuggestion: [
        {
            id: 0,
            title: 'B34/TM/GAWI INTI - 1',
            desc: 'Dikarenakan Panen Terakhir : 10 Agustus 2019',
            image: Images.img_forest,
            data: [
                {
                    id: 1,
                    type: 'inspeksi',
                    tanggal: '20 Aug 2019',
                    title: 'Inspeksi oleh Assisten Lapangan',
                    data_item: {
                        jumlah_baris: '50, 60',
                        kepala_kebun: 'Suherman',
                        tgl_inspeksi_terakhir: '15 Jul 2018'
                    }
                },
                {
                    id: 2,
                    type: 'panen',
                    tanggal: '06 Aug 2019',
                    title: 'Panen',
                    data_item: {
                        total_janjang_panen: '1,250',
                        bjr_bulan_lalu: '20',
                        total_restan_tph: '100'
                    }
                },
                {
                    id: 3,
                    type: 'rawat',
                    tanggal: '20 Jul 2019',
                    title: 'Rawat',
                    data_item: {
                        cpt_spraying: '06 Aug 19, 20 Ha, 30HK',
                        spot_spraying: '01 Aug 19, 20 Ha, 30HK',
                        lalang_ctrl: '20 Jul 19, 20 Ha, 30HK',
                    }
                },
            ]
        },
        {
            id: 1,
            title: 'F34/TM/GAWI INTI - 2',
            desc: 'Dikarenakan Panen Terakhir : 20 September 2019',
            image: Images.ic_no_pic,
            data: [
                {
                    id: 1,
                    type: 'inspeksi',
                    tanggal: '25 Oct 2019',
                    title: 'Inspeksi oleh Assisten Lapangan',
                    data_item: {
                        jumlah_baris: '2, 2',
                        kepala_kebun: 'Bambang Supriyadi',
                        tgl_inspeksi_terakhir: '20 Jul 2018'
                    }
                },
                {
                    id: 2,
                    type: 'panen',
                    tanggal: '20 Oct 2019',
                    title: 'Panen',
                    data_item: {
                        total_janjang_panen: '1,500',
                        bjr_bulan_lalu: '15',
                        total_restan_tph: '50'
                    }
                },
                {
                    id: 3,
                    type: 'rawat',
                    tanggal: '15 Oct 2019',
                    title: 'Rawat',
                    data_item: {
                        cpt_spraying: '20 Sept 19, 15 Ha, 15HK',
                        spot_spraying: '01 Oct 19, 15 Ha, 15HK',
                        lalang_ctrl: '21 Jul 19, 15 Ha, 15HK',
                    }
                },
            ]
        }
    ]
}

export default dataSuggestion;