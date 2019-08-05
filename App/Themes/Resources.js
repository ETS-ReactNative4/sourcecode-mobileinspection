import { Images } from ".";

// SHOW ICON PROGRESS BASE ON STATUS FINDING
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

//SHOW STATUS IMAGE BASE ON STATUS IMAGE
export function getStatusImage(status) {
  if (status == 'SEBELUM') {
    return 'Before'
  } else {
    return 'After'
  }
}

//SHOW STATUS TEMUAN BASE ON VALUE
export function getStatusTemuan(value) {
  switch (value) {
    case 0:
      return 'BARU';
    case 100:
      return 'SELESAI';
    default:
      return 'SEDANG DIPROSES';
  }
}

//GET COLOR BASE ON STATUS FINDING
export function getColor(status) {
  switch (status) {
    case 'SELESAI':
      return 'rgba(35, 144, 35, 0.8)';
    case 'SEDANG DIPROSES':
      return 'rgba(254, 178, 54, 0.8)';
    case 'BARU':
      return 'rgba(255, 77, 77, 0.8)';
    case 'Batas waktu belum ditentukan':
      return 'red';
    default:
      return '#ff7b25';
  }
}

//SHOW ICON FILTER BASE ON FILTER
export function changeIconFilter(isFilter) {
  if (isFilter) {
    return Images.ic_filter_on
  } else {
    return Images.ic_filter_off
  }
}

//SHOW IMAGE BACKGROUND BASE ON FILTER
export function changeBgFilter(isFilter) {
  if (isFilter) {
    return Images.img_no_filter
  } else {
    return Images.img_no_data
  }
}

//SHOW EMOTE BASE ON RATING
export function getRating(rating) {
  switch (rating) {
    case 1:
      return Images.ic_rating_bad;
    case 2:
      return Images.ic_rating_ok;
    case 3:
      return Images.ic_rating_good;
    case 4:
      return Images.ic_rating_great;
    default:
      return 0;
  }
}
