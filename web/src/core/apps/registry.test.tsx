import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppTiles } from '@/core/dashboard/AppTiles'
import { AppsPage } from '@/core/pages/AppsPage'
import { useAppPrefs } from './appPrefs'
import { apps } from './registry'

const inRouter = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('app manifests', () => {
  it('have unique, URL-safe ids', () => {
    const ids = apps.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/)
  })

  it('use the "<id>.open" permission convention', () => {
    for (const app of apps) expect(app.permission).toBe(`${app.id}.open`)
  })

  it('start their tabs with the app home', () => {
    for (const app of apps) expect(app.nav[0]?.path).toBe('')
  })
})

describe('launcher', () => {
  it('shows a tile for every app', () => {
    inRouter(<AppTiles />)
    for (const app of apps) expect(screen.getByText(app.name)).toBeInTheDocument()
  })

  it('pins and unpins an app', () => {
    function PinnedList() {
      return <output data-testid="pinned">{useAppPrefs().pinned.join(',')}</output>
    }
    inRouter(
      <>
        <AppTiles />
        <PinnedList />
      </>,
    )
    const app = apps.find((a) => a.id === 'pms')!
    const pinned = () => screen.getByTestId('pinned').textContent ?? ''

    expect(pinned()).not.toContain('pms')
    fireEvent.click(screen.getByRole('button', { name: `Pin ${app.name}` }))
    expect(pinned()).toContain('pms')
    fireEvent.click(screen.getByRole('button', { name: `Unpin ${app.name}` }))
    expect(pinned()).not.toContain('pms')
  })
})

describe('app directory', () => {
  it('filters apps by search text and category', () => {
    inRouter(<AppsPage />)
    const list = () => within(screen.getByRole('list'))

    fireEvent.change(screen.getByPlaceholderText('Filter apps…'), { target: { value: 'expense' } })
    expect(list().getByText('Verve Reimbursement')).toBeInTheDocument()
    expect(list().queryByText('Verve PMS')).not.toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Filter apps…'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'People' }))
    expect(list().getByText('Verve Onboarding')).toBeInTheDocument()
    expect(list().getByText('Verve Exit')).toBeInTheDocument()
    expect(list().queryByText('VerveFit')).not.toBeInTheDocument()
  })
})
