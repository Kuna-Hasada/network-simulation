import { useMemo, useState } from 'react'
import './App.css'
import PixiStage from './components/PixiStage'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { setPlacementType, type DeviceType } from './store/topologySlice'
import { deviceIconSvg } from './components/deviceIconSvg'

const DeviceIcon = ({ type }: { type: DeviceType }) => (
  <span
    className="device-icon"
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: deviceIconSvg(type) }}
  />
)

type PcModalProps = {
  label: string
  onClose: () => void
}

const PcInspectorModal = ({ label, onClose }: PcModalProps) => {
  const [activeTab, setActiveTab] = useState('Physical')
  const [activeDesktopApp, setActiveDesktopApp] = useState<string | null>(null)
  const desktopItems = [
    { label: 'IP Configuration', icon: 'ip' },
    { label: 'Dial-up', icon: 'dial' },
    { label: 'Terminal', icon: 'terminal' },
    { label: 'Command Prompt', icon: 'prompt' },
    { label: 'Web Browser', icon: 'browser' },
    { label: 'PC Wireless', icon: 'wifi' },
    { label: 'VPN', icon: 'lock' },
    { label: 'Traffic Generator', icon: 'traffic' },
    { label: 'MIB Browser', icon: 'mib' },
    { label: 'IP Communicator', icon: 'phone' },
    { label: 'Email', icon: 'mail' },
    { label: 'PPPoE Dialer', icon: 'router' },
    { label: 'Text Editor', icon: 'note' },
    { label: 'Firewall', icon: 'shield' },
    { label: 'IPv6 Firewall', icon: 'shield6' },
    { label: 'Netflow Collector', icon: 'chart' },
    { label: 'IoT IDE', icon: 'chip' },
    { label: 'TFTP Service', icon: 'folder' },
    { label: 'Telnet / SSH Client', icon: 'terminal' },
    { label: 'Bluetooth', icon: 'bluetooth' },
    { label: 'IoT Monitor', icon: 'monitor' },
    { label: 'IoT IDE', icon: 'chip' },
    { label: 'Supervisory Workstation', icon: 'chart' },
    { label: 'User Apps Manager', icon: 'apps' },
  ]

  const DesktopIcon = ({ icon }: { icon: string }) => {
    if (icon === 'terminal') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="8" y="10" width="32" height="24" rx="4" />
          <path d="M16 20l6 4-6 4" />
          <line x1="26" y1="28" x2="34" y2="28" />
        </svg>
      )
    }
    if (icon === 'prompt') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="8" y="10" width="32" height="24" rx="4" />
          <path d="M16 20l6 4-6 4" />
        </svg>
      )
    }
    if (icon === 'browser') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="12" />
          <line x1="12" y1="24" x2="36" y2="24" />
          <path d="M18 16c3 3 3 13 0 16" />
          <path d="M30 16c-3 3-3 13 0 16" />
        </svg>
      )
    }
    if (icon === 'wifi') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="30" r="3" />
          <path d="M14 22c6-6 14-6 20 0" />
          <path d="M10 18c8-8 20-8 28 0" />
        </svg>
      )
    }
    if (icon === 'lock') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="14" y="22" width="20" height="16" rx="3" />
          <path d="M18 22v-4a6 6 0 0 1 12 0v4" />
        </svg>
      )
    }
    if (icon === 'mail') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="10" y="16" width="28" height="18" rx="3" />
          <path d="M10 18l14 10 14-10" />
        </svg>
      )
    }
    if (icon === 'router') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="10" y="18" width="28" height="12" rx="5" />
          <line x1="16" y1="24" x2="32" y2="24" />
        </svg>
      )
    }
    if (icon === 'note') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="12" y="10" width="24" height="28" rx="3" />
          <line x1="16" y1="18" x2="32" y2="18" />
          <line x1="16" y1="24" x2="32" y2="24" />
          <line x1="16" y1="30" x2="28" y2="30" />
        </svg>
      )
    }
    if (icon === 'shield' || icon === 'shield6') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 10l12 4v10c0 8-6 12-12 14-6-2-12-6-12-14V14z" />
          {icon === 'shield6' ? <text x="18" y="27">IPv6</text> : null}
        </svg>
      )
    }
    if (icon === 'chart') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="12" y="26" width="5" height="10" />
          <rect x="21" y="20" width="5" height="16" />
          <rect x="30" y="16" width="5" height="20" />
        </svg>
      )
    }
    if (icon === 'chip') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="16" y="16" width="16" height="16" rx="2" />
          <line x1="12" y1="20" x2="16" y2="20" />
          <line x1="12" y1="28" x2="16" y2="28" />
          <line x1="32" y1="20" x2="36" y2="20" />
          <line x1="32" y1="28" x2="36" y2="28" />
        </svg>
      )
    }
    if (icon === 'folder') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M10 18h10l4 4h14v14H10z" />
        </svg>
      )
    }
    if (icon === 'bluetooth') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M20 12l8 8-8 8 8 8-8 8V12z" />
          <line x1="20" y1="20" x2="30" y2="14" />
          <line x1="20" y1="28" x2="30" y2="34" />
        </svg>
      )
    }
    if (icon === 'monitor') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="10" y="12" width="28" height="18" rx="3" />
          <line x1="18" y1="34" x2="30" y2="34" />
          <line x1="24" y1="30" x2="24" y2="34" />
        </svg>
      )
    }
    if (icon === 'apps') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="12" y="12" width="8" height="8" />
          <rect x="24" y="12" width="8" height="8" />
          <rect x="12" y="24" width="8" height="8" />
          <rect x="24" y="24" width="8" height="8" />
        </svg>
      )
    }
    if (icon === 'ip' || icon === 'dial' || icon === 'traffic' || icon === 'mib' || icon === 'phone') {
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="12" y="14" width="24" height="20" rx="4" />
          <line x1="18" y1="24" x2="30" y2="24" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="12" y="14" width="24" height="20" rx="4" />
      </svg>
    )
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal pc-modal" onClick={(event) => event.stopPropagation()}>
        <div className="pc-titlebar">
          <div className="pc-title">{label}</div>
          <button className="pc-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="pc-tabs">
          {['Physical', 'Config', 'Desktop', 'Programming', 'Attributes'].map((tab) => (
            <button
              key={tab}
              className={`pc-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="pc-content">
          {activeTab === 'Physical' ? (
            <div className="pc-body">
              <aside className="pc-sidebar">
                <div className="pc-sidebar-title">Modules</div>
                <div className="pc-module">WMP300N</div>
                <div className="pc-module">PT-HOST-NM-1AM</div>
                <div className="pc-module">PT-HOST-NM-1CFE</div>
                <div className="pc-module">PT-HOST-NM-1CFE</div>
                <div className="pc-module">PT-HOST-NM-1CGE</div>
                <div className="pc-module">PT-HOST-NM-1FFE</div>
                <div className="pc-module">PT-HOST-NM-1FFE-SM</div>
                <div className="pc-module">PT-HOST-NM-1FGE</div>
                <div className="pc-module">PT-HOST-NM-1W</div>
                <div className="pc-module">PT-HEADPHONE</div>
                <div className="pc-module">PT-MICROPHONE</div>
              </aside>
              <section className="pc-panel">
                <div className="pc-panel-header">Physical Device View</div>
                <div className="pc-toolbar">
                  <button>Zoom In</button>
                  <button className="active">Original Size</button>
                  <button>Zoom Out</button>
                </div>
                <div className="pc-device-view">
                  <div className="pc-device-placeholder">Device View</div>
                </div>
                <div className="pc-bottom">
                  <button className="pc-action">Customize Icon in Physical View</button>
                  <button className="pc-action">Customize Icon in Logical View</button>
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === 'Config' ? (
            <div className="pc-config pc-config-layout">
              <aside className="pc-config-nav">
                <div className="pc-config-group">GLOBAL</div>
                <button className="pc-config-item active" type="button">
                  Settings
                </button>
                <div className="pc-config-group">INTERFACE</div>
                <button className="pc-config-item" type="button">
                  FastEthernet0
                </button>
                <button className="pc-config-item" type="button">
                  Bluetooth
                </button>
              </aside>

              <section className="pc-config-main">
                <div className="pc-panel-header">Global Settings</div>
                <div className="pc-form">
                  <label>
                    Display Name
                    <input type="text" defaultValue={label} />
                  </label>
                  <label>
                    Interfaces
                    <select defaultValue="FastEthernet0">
                      <option>FastEthernet0</option>
                      <option>Bluetooth</option>
                    </select>
                  </label>
                </div>

                <div className="pc-section">
                  <p>Gateway/DNS IPv4</p>
                  <div className="pc-radio-row">
                    <label className="pc-inline">
                      <input type="radio" name="ipv4" defaultChecked /> DHCP
                    </label>
                    <label className="pc-inline">
                      <input type="radio" name="ipv4" /> Static
                    </label>
                  </div>
                  <label>
                    Default Gateway
                    <input type="text" placeholder="" />
                  </label>
                  <label>
                    DNS Server
                    <input type="text" placeholder="" />
                  </label>
                </div>

                <div className="pc-section">
                  <p>Gateway/DNS IPv6</p>
                  <div className="pc-radio-row">
                    <label className="pc-inline">
                      <input type="radio" name="ipv6" defaultChecked /> Automatic
                    </label>
                    <label className="pc-inline">
                      <input type="radio" name="ipv6" /> Static
                    </label>
                  </div>
                  <label>
                    Default Gateway
                    <input type="text" placeholder="" />
                  </label>
                  <label>
                    DNS Server
                    <input type="text" placeholder="" />
                  </label>
                </div>

                <div className="pc-section">
                  <div className="pc-inline-row">
                    <span>Device Clock:</span>
                    <span className="pc-clock">00:03:44 Mon Mar 1 1993 UTC</span>
                  </div>
                </div>

                <div className="pc-section">
                  <p>NTP</p>
                  <label>
                    Server IP
                    <input type="text" placeholder="" />
                  </label>
                  <div className="pc-subpanel">
                    <div className="pc-subpanel-title">Authentication</div>
                    <div className="pc-radio-row">
                      <label className="pc-inline">
                        <input type="radio" name="ntp-auth" defaultChecked /> Enable
                      </label>
                      <label className="pc-inline">
                        <input type="radio" name="ntp-auth" /> Disable
                      </label>
                    </div>
                    <label>
                      Password
                      <input type="password" placeholder="" />
                    </label>
                  </div>
                </div>

                <div className="pc-section">
                  <p>PTP</p>
                  <div className="pc-form">
                    <label>
                      Profile
                      <select defaultValue="Power">
                        <option>Power</option>
                        <option>Default</option>
                        <option>Telecom</option>
                      </select>
                    </label>
                    <div className="pc-radio-stack">
                      <span className="pc-radio-label">Enable</span>
                      <div className="pc-radio-row">
                        <label className="pc-inline">
                          <input type="radio" name="ptp" defaultChecked /> Enable
                        </label>
                        <label className="pc-inline">
                          <input type="radio" name="ptp" /> Disable
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === 'Desktop' ? (
            <div className="pc-desktop">
              {activeDesktopApp === 'IP Configuration' ? (
                <div className="pc-desktop-app">
                  <div className="pc-desktop-app-header">
                    <button className="pc-desktop-back" onClick={() => setActiveDesktopApp(null)}>
                      Back
                    </button>
                    <div className="pc-desktop-title">IP Configuration</div>
                  </div>

                  <div className="pc-config-block">
                    <div className="pc-config-block-title">Interface</div>
                    <select defaultValue="FastEthernet0">
                      <option>FastEthernet0</option>
                      <option>Bluetooth</option>
                    </select>
                  </div>

                  <div className="pc-config-block">
                    <div className="pc-config-block-title">IP Configuration</div>
                    <div className="pc-radio-row">
                      <label className="pc-inline">
                        <input type="radio" name="ip-desktop-ipv4" defaultChecked /> DHCP
                      </label>
                      <label className="pc-inline">
                        <input type="radio" name="ip-desktop-ipv4" /> Static
                      </label>
                    </div>
                    <div className="pc-field-grid">
                      <label>
                        IPv4 Address
                        <input type="text" placeholder="" />
                      </label>
                      <label>
                        Subnet Mask
                        <input type="text" placeholder="" />
                      </label>
                      <label>
                        Default Gateway
                        <input type="text" defaultValue="0.0.0.0" />
                      </label>
                      <label>
                        DNS Server
                        <input type="text" defaultValue="0.0.0.0" />
                      </label>
                    </div>
                  </div>

                  <div className="pc-config-block">
                    <div className="pc-config-block-title">IPv6 Configuration</div>
                    <div className="pc-radio-row">
                      <label className="pc-inline">
                        <input type="radio" name="ip-desktop-ipv6" defaultChecked /> Automatic
                      </label>
                      <label className="pc-inline">
                        <input type="radio" name="ip-desktop-ipv6" /> Static
                      </label>
                    </div>
                    <div className="pc-field-grid">
                      <label>
                        IPv6 Address
                        <div className="pc-field-split">
                          <input type="text" placeholder="" />
                          <input type="text" placeholder="/" className="pc-field-prefix" />
                        </div>
                      </label>
                      <label>
                        Link Local Address
                        <input type="text" defaultValue="FE80::2D0:BAFF:FE59:8E51" />
                      </label>
                      <label>
                        Default Gateway
                        <input type="text" placeholder="" />
                      </label>
                      <label>
                        DNS Server
                        <input type="text" placeholder="" />
                      </label>
                    </div>
                  </div>

                  <div className="pc-config-block">
                    <div className="pc-config-block-title">802.1X</div>
                    <label className="pc-inline">
                      <input type="checkbox" /> Use 802.1X Security
                    </label>
                    <div className="pc-field-grid">
                      <label>
                        Authentication
                        <select defaultValue="MD5">
                          <option>MD5</option>
                          <option>PEAP</option>
                          <option>TLS</option>
                        </select>
                      </label>
                      <label>
                        Username
                        <input type="text" placeholder="" />
                      </label>
                      <label>
                        Password
                        <input type="password" placeholder="" />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pc-desktop-grid">
                  {desktopItems.map((item) => (
                    <button
                      key={item.label}
                      className="pc-desktop-tile"
                      onClick={() => setActiveDesktopApp(item.label)}
                    >
                      <span className="pc-desktop-icon">
                        <DesktopIcon icon={item.icon} />
                      </span>
                      <span className="pc-desktop-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {activeTab === 'Programming' ? (
            <div className="pc-programming">
              <div className="pc-panel-header">Programming</div>
              <div className="pc-code">
                <div className="pc-code-header">main.txt</div>
                <pre>{'# Write a script here\nprint("Hello from PC")\n'}</pre>
              </div>
            </div>
          ) : null}

          {activeTab === 'Attributes' ? (
            <div className="pc-attributes">
              <div className="pc-panel-header">Attributes</div>
              <div className="pc-attr-grid">
                <div>
                  <span>CPU</span>
                  <strong>Generic x86</strong>
                </div>
                <div>
                  <span>RAM</span>
                  <strong>512 MB</strong>
                </div>
                <div>
                  <span>NIC</span>
                  <strong>FastEthernet0</strong>
                </div>
                <div>
                  <span>Wireless</span>
                  <strong>WMP300N</strong>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function App() {
  const dispatch = useAppDispatch()
  const [activeCategory, setActiveCategory] = useState('Network Devices')
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const selectedNode = useAppSelector((state) =>
    state.topology.nodes.find((node) => node.id === state.topology.selectedNodeId)
  )
  const placementType = useAppSelector((state) => state.topology.placementType)
  const nodes = useAppSelector((state) => state.topology.nodes)

  const labelMap: Record<DeviceType, string> = {
    router: 'Router',
    'switch-l2': 'L2 Switch',
    'switch-l3': 'L3 Switch',
    firewall: 'Firewall',
    server: 'Server',
    pc: 'PC',
    laptop: 'Laptop',
    ap: 'Wireless AP',
    cloud: 'Cloud',
    isp: 'ISP',
    hub: 'Hub',
  }

  const deviceCatalog: {
    type: DeviceType
    name: string
    detail: string
    category: string
  }[] = [
    { type: 'router', name: 'Router', detail: 'Routing, NAT, ACL', category: 'Network Devices' },
    { type: 'switch-l2', name: 'L2 Switch', detail: 'VLANs, L2 forwarding', category: 'Network Devices' },
    { type: 'switch-l3', name: 'L3 Switch', detail: 'Inter-VLAN routing', category: 'Network Devices' },
    { type: 'firewall', name: 'Firewall', detail: 'Policy, NAT, filtering', category: 'Network Devices' },
    { type: 'hub', name: 'Hub', detail: 'Legacy shared media', category: 'Network Devices' },
    { type: 'pc', name: 'PC', detail: 'End host', category: 'End Devices' },
    { type: 'laptop', name: 'Laptop', detail: 'Portable host', category: 'End Devices' },
    { type: 'server', name: 'Server', detail: 'DHCP/DNS/Web', category: 'End Devices' },
    { type: 'ap', name: 'Wireless AP', detail: 'Wi-Fi access', category: 'Wireless' },
    { type: 'cloud', name: 'Cloud', detail: 'External network', category: 'WAN/Cloud' },
    { type: 'isp', name: 'ISP', detail: 'Upstream provider', category: 'WAN/Cloud' },
  ]

  const categories = useMemo(
    () => Array.from(new Set(deviceCatalog.map((device) => device.category))),
    [deviceCatalog]
  )

  const visibleDevices = deviceCatalog.filter((device) => device.category === activeCategory)

  const handleSelectDevice = (type: DeviceType) => {
    dispatch(setPlacementType(type))
  }

  const handleInspect = () => {
    setInspectorOpen(true)
  }

  return (
    <>
      <div className="app-shell">
        <header className="top-bar">
        <div>
          <p className="eyebrow">Offline Network Lab</p>
          <h1>PacketFlow Studio</h1>
          <p className="subtitle">Design, simulate, and inspect virtual networks in real time.</p>
        </div>
        <div className="status">
          <div>
            <span className="status-dot" />
            Simulation paused
          </div>
          <button className="primary">Run</button>
        </div>
      </header>

      <section className="device-bar">
        <div className="device-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`device-tab ${category === activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="device-strip">
          {visibleDevices.map((device) => (
            <button
              key={device.type}
              className="device-tile"
              onClick={() => handleSelectDevice(device.type)}
            >
              <DeviceIcon type={device.type} />
              <span>{device.name}</span>
            </button>
          ))}
        </div>
        <p className="device-help">Select a device, then click on the canvas to place it.</p>
      </section>

      <main className="workspace">
        <aside className="panel">
          <h2>Tools</h2>
          <ul className="tool-list">
            <li>Connect</li>
            <li>Subnet Planner</li>
            <li>Packet Inspector</li>
            <li>Scenario Recorder</li>
          </ul>
        </aside>

        <section className="stage-wrap">
          <div className="stage-header">
            <div>
              <h2>Topology</h2>
              <p>
                Drag devices, draw links, and run protocol simulations.
                {placementType ? (
                  <span className="placement-hint">
                    Click on the canvas to place a {labelMap[placementType]}.
                  </span>
                ) : null}
              </p>
            </div>
            <div className="stage-actions">
              <button>Capture</button>
              <button>Validate</button>
            </div>
          </div>
          <PixiStage onInspect={handleInspect} />
        </section>
      </main>
      {inspectorOpen && selectedNode && (selectedNode.type === 'pc' || selectedNode.type === 'laptop') ? (
        <PcInspectorModal label={selectedNode.label} onClose={() => setInspectorOpen(false)} />
      ) : null}
    </div>
    </>
  )
}

export default App
