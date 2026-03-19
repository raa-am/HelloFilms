import { describe, it, expect } from 'vitest'
import { helpers, required, minLength, maxLength, between } from '@vuelidate/validators'

const alphaOnly = helpers.regex(/^[a-zA-ZÀ-ÿ\s]+$/)
const alphanumeric = helpers.regex(/^[a-zA-Z0-9À-ÿ\s.,!?'"()-]+$/)

describe('validator - username', () => {
  it('accepte un nom valide', () => {
    expect(alphaOnly('Alice')).toBe(true)
  })

  it('refuse un nom avec des chiffres', () => {
    expect(alphaOnly('Alice123')).toBe(false)
  })

  it('refuse un nom trop court', () => {
    expect(minLength(3).$validator('ab', {}, {})).toBe(false)
  })

  it('accepte un nom à la longueur minimale', () => {
    expect(minLength(3).$validator('abc', {}, {})).toBe(true)
  })

  it('refuse un nom trop long', () => {
    expect(maxLength(50).$validator('a'.repeat(51), {}, {})).toBe(false)
  })

  it('refuse un champ vide', () => {
    expect(required.$validator('', {}, {})).toBe(false)
  })
})

describe('validator - message', () => {
  it('accepte un message valide', () => {
    expect(alphanumeric('Super film !')).toBe(true)
  })

  it('refuse un message avec des caractères spéciaux non autorisés', () => {
    expect(alphanumeric('test <script>')).toBe(false)
  })

  it('refuse un message trop court', () => {
    expect(minLength(3).$validator('ab', {}, {})).toBe(false)
  })

  it('refuse un message trop long', () => {
    expect(maxLength(500).$validator('a'.repeat(501), {}, {})).toBe(false)
  })
})

describe('validator - rating', () => {
  it('accepte une note entre 1 et 10', () => {
    expect(between(1, 10).$validator(7, {}, {})).toBe(true)
  })

  it('refuse une note à 0', () => {
    expect(between(1, 10).$validator(0, {}, {})).toBe(false)
  })

  it('refuse une note supérieure à 10', () => {
    expect(between(1, 10).$validator(11, {}, {})).toBe(false)
  })

  it('accepte les bornes 1 et 10', () => {
    expect(between(1, 10).$validator(1, {}, {})).toBe(true)
    expect(between(1, 10).$validator(10, {}, {})).toBe(true)
  })
})
