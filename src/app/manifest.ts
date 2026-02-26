import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Econosfera | Terminal Económica',
        short_name: 'Econosfera',
        description: 'Terminal de simulación económica y financiera para profesionales.',
        start_url: '/',
        display: 'standalone',
        background_color: '#020617',
        theme_color: '#2563eb',
        icons: [
            {
                src: '/favicon.png',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
