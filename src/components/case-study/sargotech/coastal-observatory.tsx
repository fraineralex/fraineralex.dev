'use client'

/*
 * Adapted from the public coastal map on the SargoTech landing: same layers,
 * clustering and colors. This copy has no live readings. Each beach gets an
 * illustrative level derived only from its coordinates and name (sample data,
 * labeled on screen), so the traffic light can be seen working. Neutral vector
 * basemap from public domain outlines with self hosted glyphs, so nothing is
 * fetched from third party services. Adds ES/EN copy, cooperative gestures, a
 * keyboard beach picker and reduced motion camera moves.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Compass, MousePointer2, Satellite, X } from 'lucide-react'
import maplibregl, { type GeoJSONSource, type GeoJSONSourceSpecification, type Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './observatory.css'
import { dominicanBeaches } from './dominican-beaches'
import coast from './coast.json'
import neighbors from './neighbors.json'

type Lang = 'en' | 'es'
type Level = 'red' | 'yellow' | 'green'
type BeachProperties = { id: string; name: string; level: Level; score: number }

const COPY = {
	es: {
		aria: 'Mapa interactivo del semáforo costero de República Dominicana',
		toolbar: 'SEMÁFORO POR PLAYA',
		mode: 'DATOS DE EJEMPLO',
		country: 'República Dominicana',
		observed: (n: number) => `${n} playas en el mapa`,
		note: 'Datos de ejemplo: los colores muestran cómo funciona el semáforo, no son lecturas reales. En el sitio en vivo cada playa toma su color según la cantidad de sargazo.',
		legend: 'Semáforo costero',
		red: ['Rojo', 'impacto probable'],
		yellow: ['Amarillo', 'sargazo próximo'],
		green: ['Verde', 'sin alerta cercana'],
		levels: { red: 'ROJO', yellow: 'AMARILLO', green: 'VERDE' },
		close: 'Cerrar detalle',
		statusLabel: 'Estado',
		statusValue: 'Datos de ejemplo',
		coords: 'Coordenadas',
		drag: 'Arrastra para explorar',
		rotate: 'Ctrl + arrastrar para girar',
		pick: 'Ir a una playa',
		pickPlaceholder: 'Elige una playa',
		gestures: { windowsHelpText: 'Usa Ctrl + rueda para acercar el mapa', macHelpText: 'Usa ⌘ + rueda para acercar el mapa', mobileHelpText: 'Usa dos dedos para mover el mapa' },
	},
	en: {
		aria: 'Interactive coastal traffic light map of the Dominican Republic',
		toolbar: 'TRAFFIC LIGHT PER BEACH',
		mode: 'SAMPLE DATA',
		country: 'Dominican Republic',
		observed: (n: number) => `${n} beaches on the map`,
		note: 'Sample data: the colors show how the traffic light works, they are not real readings. On the live site each beach takes its color from the amount of sargassum.',
		legend: 'Coastal traffic light',
		red: ['Red', 'likely impact'],
		yellow: ['Yellow', 'sargassum nearby'],
		green: ['Green', 'no nearby alert'],
		levels: { red: 'RED', yellow: 'YELLOW', green: 'GREEN' },
		close: 'Close detail',
		statusLabel: 'Status',
		statusValue: 'Sample data',
		coords: 'Coordinates',
		drag: 'Drag to explore',
		rotate: 'Ctrl + drag to rotate',
		pick: 'Jump to a beach',
		pickPlaceholder: 'Pick a beach',
		gestures: { windowsHelpText: 'Use Ctrl + scroll to zoom the map', macHelpText: 'Use ⌘ + scroll to zoom the map', mobileHelpText: 'Use two fingers to move the map' },
	},
} as const

const COLORS: Record<Level, string> = { red: '#ef4444', yellow: '#f59e0b', green: '#22c55e' }
const SCORE: Record<Level, number> = { red: 3, yellow: 2, green: 1 }

/**
 * Illustrative level for the sample map, derived only from coordinates and
 * name: the east and south east coasts lean red, the north coast is mixed and
 * the west leans green, with a stable per beach variation. Not real data.
 */
function sampleLevel(name: string, lat: number, lon: number): Level {
	let hash = 0
	for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
	const jitter = ((hash % 1000) / 1000 - 0.5) * 0.5
	let base = 0.15
	if (lon > -68.95) base = 0.8
	else if (lat < 18.6 && lon > -70.2) base = 0.55
	else if (lat > 19.25 && lon > -70.4) base = 0.5
	else if (lat < 18.6 && lon > -70.9) base = 0.3
	const value = base + jitter
	return value > 0.62 ? 'red' : value > 0.36 ? 'yellow' : 'green'
}

const levelColor = ['match', ['get', 'level'], 'red', COLORS.red, 'yellow', COLORS.yellow, COLORS.green] as unknown as string
const clusterColor = ['match', ['get', 'maxScore'], 3, COLORS.red, 2, COLORS.yellow, COLORS.green] as unknown as string

function prefersReducedMotion() {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CoastalObservatory({ lang = 'en' }: { lang?: Lang }) {
	const t = COPY[lang]
	const mapContainer = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<MapLibreMap | null>(null)
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const beaches = useMemo(() => dominicanBeaches.map((beach, index) => ({ ...beach, id: `beach-${index}`, level: sampleLevel(beach.name, beach.lat, beach.lon) })), [])

	const counts = useMemo(() => beaches.reduce((total, beach) => ({ ...total, [beach.level]: total[beach.level] + 1 }), { red: 0, yellow: 0, green: 0 } as Record<Level, number>), [beaches])

	const semaphoreFeatures = useMemo(
		() => ({
			type: 'FeatureCollection' as const,
			features: beaches.map((beach) => {
				const properties: BeachProperties = { id: beach.id, name: beach.name, level: beach.level, score: SCORE[beach.level] }
				return { type: 'Feature' as const, properties, geometry: { type: 'Point' as const, coordinates: [beach.lon, beach.lat] as [number, number] } }
			}),
		}),
		[beaches],
	)

	const sortedBeaches = useMemo(() => [...beaches].sort((x, y) => x.name.localeCompare(y.name, 'es')), [beaches])

	const selected = beaches.find((beach) => beach.id === selectedId) ?? null

	useEffect(() => {
		if (!mapContainer.current || mapRef.current) return
		const map = new maplibregl.Map({
			container: mapContainer.current,
			center: [-70.05, 18.82],
			zoom: 7.15,
			pitch: 38,
			bearing: -8,
			attributionControl: false,
			interactive: true,
			cooperativeGestures: true,
			locale: { 'CooperativeGesturesHandler.WindowsHelpText': t.gestures.windowsHelpText, 'CooperativeGesturesHandler.MacHelpText': t.gestures.macHelpText, 'CooperativeGesturesHandler.MobileHelpText': t.gestures.mobileHelpText },
			style: {
				version: 8,
				glyphs: `${window.location.origin}/map-glyphs/{fontstack}/{range}.pbf`,
				sources: {
					'neighbor-land': { type: 'geojson', data: neighbors as GeoJSONSourceSpecification['data'] },
					'dominican-emphasis': { type: 'geojson', data: coast as GeoJSONSourceSpecification['data'] },
					'beach-semaphore': { type: 'geojson', data: semaphoreFeatures, cluster: true, clusterRadius: 28, clusterMaxZoom: 8, clusterProperties: { maxScore: ['max', ['get', 'score']] } },
				},
				layers: [
					{ id: 'neutral-sea', type: 'background', paint: { 'background-color': '#eaf4fb' } },
					{ id: 'neutral-neighbor-land', type: 'fill', source: 'neighbor-land', paint: { 'fill-color': '#f7f9fc', 'fill-outline-color': '#e1e7ef' } },
					{ id: 'neutral-dominican-land', type: 'fill', source: 'dominican-emphasis', paint: { 'fill-color': '#ffffff' } },
					{ id: 'dominican-white-shade', type: 'fill', source: 'dominican-emphasis', paint: { 'fill-color': '#ffffff', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.15, 8, 0.09, 12, 0.035] } },
					{ id: 'dominican-white-outline', type: 'line', source: 'dominican-emphasis', paint: { 'line-color': '#e1e7ef', 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1.4, 9, 2.1, 13, 2.8], 'line-opacity': 0.82, 'line-blur': 0.2 } },
				],
			},
		})
		map.addControl(new maplibregl.NavigationControl({ visualizePitch: true, showCompass: true, showZoom: true }), 'bottom-right')
		map.on('load', () => {
			map.addLayer({ id: 'landing-beach-clusters-halo', type: 'circle', source: 'beach-semaphore', filter: ['has', 'point_count'], paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 21, 9, 29], 'circle-color': clusterColor, 'circle-opacity': 0.24, 'circle-blur': 0.45 } })
			map.addLayer({ id: 'landing-beach-clusters', type: 'circle', source: 'beach-semaphore', filter: ['has', 'point_count'], paint: { 'circle-radius': ['interpolate', ['linear'], ['get', 'point_count'], 2, 13, 8, 19, 20, 26], 'circle-color': clusterColor, 'circle-stroke-color': 'rgba(255,255,255,.9)', 'circle-stroke-width': 2, 'circle-opacity': 0.96 } })
			map.addLayer({ id: 'landing-beach-count', type: 'symbol', source: 'beach-semaphore', filter: ['has', 'point_count'], layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['sans-semibold'], 'text-size': 12, 'text-allow-overlap': true }, paint: { 'text-color': '#fff', 'text-halo-color': 'rgba(2,6,23,.72)', 'text-halo-width': 1.2 } })
			map.addLayer({ id: 'landing-beach-points-halo', type: 'circle', source: 'beach-semaphore', filter: ['!', ['has', 'point_count']], paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 10, 11, 17], 'circle-color': levelColor, 'circle-opacity': 0.28, 'circle-blur': 0.45 } })
			map.addLayer({ id: 'landing-beach-points', type: 'circle', source: 'beach-semaphore', filter: ['!', ['has', 'point_count']], paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 7, 11, 11], 'circle-color': levelColor, 'circle-stroke-color': '#fff', 'circle-stroke-width': 2, 'circle-opacity': 0.98 } })
			map.addLayer({ id: 'landing-beach-labels', type: 'symbol', source: 'beach-semaphore', filter: ['!', ['has', 'point_count']], minzoom: 8.2, layout: { 'text-field': ['get', 'name'], 'text-font': ['sans-semibold'], 'text-size': 10, 'text-offset': [0, 1.3], 'text-anchor': 'top', 'text-optional': true }, paint: { 'text-color': '#1e3a5f', 'text-halo-color': 'rgba(255,255,255,.9)', 'text-halo-width': 1.3 } })
			map.on('click', 'landing-beach-clusters', (event) => {
				const feature = event.features?.[0]
				const clusterId = feature?.properties?.cluster_id
				const source = map.getSource('beach-semaphore') as GeoJSONSource | undefined
				if (!feature || feature.geometry.type !== 'Point' || clusterId === undefined || !source) return
				const coordinates = feature.geometry.coordinates as [number, number]
				source
					.getClusterExpansionZoom(Number(clusterId))
					.then((zoom) => map.easeTo({ center: coordinates, zoom: Math.min(zoom + 0.3, 12.4), pitch: 44, duration: prefersReducedMotion() ? 0 : 900 }))
					.catch(() => undefined)
			})
			map.on('click', 'landing-beach-points', (event) => {
				const feature = event.features?.[0]
				const props = feature?.properties as BeachProperties | undefined
				if (!feature || feature.geometry.type !== 'Point' || !props) return
				setSelectedId(String(props.id))
				map.easeTo({ center: feature.geometry.coordinates as [number, number], zoom: Math.max(map.getZoom(), 10), pitch: 48, duration: prefersReducedMotion() ? 0 : 850 })
			})
			for (const layer of ['landing-beach-clusters', 'landing-beach-points']) {
				map.on('mouseenter', layer, () => {
					map.getCanvas().style.cursor = 'pointer'
				})
				map.on('mouseleave', layer, () => {
					map.getCanvas().style.cursor = ''
				})
			}
		})
		map.getCanvas().setAttribute('aria-label', t.aria)
		const resizeObserver = new ResizeObserver(() => map.resize())
		resizeObserver.observe(mapContainer.current)
		mapRef.current = map
		return () => {
			resizeObserver.disconnect()
			map.remove()
			mapRef.current = null
		}
	}, [semaphoreFeatures, t])

	const jumpTo = (id: string) => {
		setSelectedId(id || null)
		const beach = beaches.find((item) => item.id === id)
		if (!beach || !mapRef.current) return
		mapRef.current.easeTo({ center: [beach.lon, beach.lat], zoom: Math.max(mapRef.current.getZoom(), 10), pitch: 48, duration: prefersReducedMotion() ? 0 : 850 })
	}

	return (
		<div className='sargo-obs'>
			<div className='public-command-map' role='region' aria-label={t.aria}>
				<div ref={mapContainer} className='public-maplibre-stage' />
				<div className='public-map-atmosphere' />
				<header className='public-map-toolbar'>
					<span>
						<Satellite size={15} aria-hidden /> {t.toolbar}
					</span>
					<span className='public-map-live reference'>
						<i />
						{t.mode}
					</span>
				</header>
				<div className='public-map-status'>
					<strong>{t.country}</strong>
					<span>{t.observed(beaches.length)}</span>
					<small>{t.note}</small>
				</div>
				<aside className='public-semaphore-legend' aria-label={t.legend}>
					<h3>{t.legend}</h3>
					<span className='red'>
						<i />
						<b>{counts.red}</b> {t.red[0]}
						<small>{t.red[1]}</small>
					</span>
					<span className='yellow'>
						<i />
						<b>{counts.yellow}</b> {t.yellow[0]}
						<small>{t.yellow[1]}</small>
					</span>
					<span className='green'>
						<i />
						<b>{counts.green}</b> {t.green[0]}
						<small>{t.green[1]}</small>
					</span>
				</aside>
				{selected && (
					<aside className='public-beach-detail' aria-live='polite'>
						<button type='button' onClick={() => setSelectedId(null)} aria-label={t.close}>
							<X size={16} aria-hidden />
						</button>
						<span className={`detail-level ${selected.level}`}>
							<i />
							{t.levels[selected.level]}
						</span>
						<h3>{selected.name}</h3>
						<dl>
							<div>
								<dt>{t.statusLabel}</dt>
								<dd>{t.statusValue}</dd>
							</div>
							<div>
								<dt>{t.coords}</dt>
								<dd>
									{selected.lat.toFixed(3)}, {selected.lon.toFixed(3)}
								</dd>
							</div>
						</dl>
					</aside>
				)}
				<div className='public-map-instructions'>
					<MousePointer2 size={14} aria-hidden />
					<span>{t.drag}</span>
					<Compass size={14} aria-hidden />
					<span>{t.rotate}</span>
				</div>
			</div>
			<label className='flex flex-col gap-2 border-t border-[#e1e7ef] px-4 py-3 text-sm text-[#62788a] sm:flex-row sm:items-center sm:gap-3'>
				<span>{t.pick}</span>
				<select
					value={selectedId ?? ''}
					onChange={(event) => jumpTo(event.target.value)}
					className='h-10 w-full rounded-lg border border-[#e1e7ef] bg-[#ffffff] px-3 text-sm text-[#1e3a5f] outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9] sm:w-80'
				>
					<option value=''>{t.pickPlaceholder}</option>
					{sortedBeaches.map((beach) => (
						<option key={beach.id} value={beach.id}>
							{beach.name}
						</option>
					))}
				</select>
			</label>
		</div>
	)
}
