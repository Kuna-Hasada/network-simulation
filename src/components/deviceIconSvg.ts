import type { DeviceType } from '../store/topologySlice'

const baseSvg = (content: string) =>
  `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#f8fafc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`

export const deviceIconSvg = (type: DeviceType) => {
  switch (type) {
    case 'router':
      return baseSvg('<circle cx="24" cy="24" r="12" /><line x1="24" y1="12" x2="24" y2="36" /><line x1="12" y1="24" x2="36" y2="24" />')
    case 'switch-l2':
      return baseSvg('<rect x="10" y="16" width="28" height="16" rx="6" /><line x1="14" y1="22" x2="34" y2="22" /><line x1="14" y1="27" x2="34" y2="27" />')
    case 'switch-l3':
      return baseSvg('<rect x="10" y="15" width="28" height="18" rx="6" /><line x1="14" y1="20" x2="34" y2="20" /><line x1="14" y1="26" x2="34" y2="26" /><circle cx="35" cy="30" r="3" />')
    case 'firewall':
      return baseSvg('<rect x="12" y="14" width="24" height="20" rx="3" /><line x1="18" y1="18" x2="18" y2="34" /><line x1="24" y1="18" x2="24" y2="34" /><line x1="30" y1="18" x2="30" y2="34" /><line x1="12" y1="22" x2="36" y2="22" /><line x1="12" y1="28" x2="36" y2="28" />')
    case 'hub':
      return baseSvg('<circle cx="24" cy="24" r="8" /><line x1="24" y1="10" x2="24" y2="16" /><line x1="24" y1="32" x2="24" y2="38" /><line x1="10" y1="24" x2="16" y2="24" /><line x1="32" y1="24" x2="38" y2="24" />')
    case 'pc':
      return baseSvg('<rect x="12" y="14" width="24" height="16" rx="4" /><line x1="18" y1="34" x2="30" y2="34" /><line x1="24" y1="30" x2="24" y2="34" />')
    case 'laptop':
      return baseSvg('<rect x="12" y="14" width="24" height="14" rx="3" /><line x1="10" y1="32" x2="38" y2="32" /><line x1="16" y1="34" x2="32" y2="34" />')
    case 'server':
      return baseSvg('<rect x="14" y="12" width="20" height="8" rx="2" /><rect x="14" y="22" width="20" height="8" rx="2" /><rect x="14" y="32" width="20" height="6" rx="2" /><circle cx="19" cy="16" r="1.5" /><circle cx="19" cy="26" r="1.5" /><circle cx="19" cy="35" r="1.5" />')
    case 'ap':
      return baseSvg('<circle cx="24" cy="30" r="4" /><path d="M14 22c6-6 14-6 20 0" /><path d="M10 18c8-8 20-8 28 0" />')
    case 'cloud':
      return baseSvg('<path d="M18 34h14a6 6 0 0 0 0-12 9 9 0 0 0-17-2 6 6 0 0 0 3 14z" />')
    case 'isp':
      return baseSvg('<circle cx="24" cy="24" r="12" /><line x1="12" y1="24" x2="36" y2="24" /><line x1="24" y1="12" x2="24" y2="36" /><line x1="16" y1="16" x2="32" y2="32" />')
    default:
      return baseSvg('<rect x="12" y="14" width="24" height="16" rx="4" />')
  }
}

export const deviceIconDataUri = (type: DeviceType) => {
  const svg = deviceIconSvg(type)
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
