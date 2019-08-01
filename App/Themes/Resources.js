import { Images } from ".";

export function getIconProgress(status) {
    switch (status) {
        case 'BARU':
            return Images.ic_new_timeline
        case 'SELESAI':
            return Images.ic_done_timeline
        default:
            return Images.ic_inprogress_timeline
    }
}

export function getStatusImage(status) {
    if (status == 'SEBELUM') {
        return 'Before'
    } else {
        return 'After'
    }
}

export function getColor(status) {
    switch (status) {
      case 'SELESAI':
        return 'rgba(35, 144, 35, 0.9)';
      case 'SEDANG DIPROSES':
        return 'rgba(254, 178, 54, 0.9)';
      case 'BARU':
        return 'rgba(255, 77, 77, 0.9)';
      case 'Batas waktu belum ditentukan':
        return 'red';
      default:
        return '#ff7b25';
    }
  }

  export function changeIconFilter(isFilter) {
    if (isFilter) {
      return Images.ic_filter_on
    } else {
      return Images.ic_filter_off
    }
  }

  export function changeBgFilter(isFilter) {
    if (isFilter) {
      return Images.img_no_filter
    } else {
      return Images.img_no_data
    }
  }