import QRCode, { QRCodeSegment, QRCodeToDataURLOptions } from 'qrcode'
import { MercadoPagoUseCase } from '../../src/useCases/mercadoPago'
import { Order } from '../domain/entities/order'
import { Product } from '../domain/entities/product'

describe('mercadoPagoUseCase', () => {
    let mercadoPagoUseCase: MercadoPagoUseCase
    let mockOrder: Order
    let mockProduct: Product
    let mockTokenData: { token: string; userId: number }

    beforeEach(() => {
        mercadoPagoUseCase = new MercadoPagoUseCase()

        mockProduct = {
            idProduct: '1',
            name: 'Pizza',
            observation: 'Cheese pizza',
            unitValue: 20,
            amount: 2,
        } as Product

        mockOrder = {
            idOrder: 'order123',
            value: 40,
            items: [mockProduct],
        } as Order

        mockTokenData = {
            token: 'Bearer mock_token',
            userId: 1234,
        }

        jest.clearAllMocks()

        jest.spyOn(QRCode, 'toDataURL').mockImplementation(
            (
                text: string | QRCodeSegment[],
                options: QRCodeToDataURLOptions,
                callback: (error: Error | null | undefined, url: string) => void
            ) => {
                if (text) {
                    callback(null, 'mock_image_url')
                } else {
                    callback(new Error('Failed to generate QR Code Image'), '')
                }
            }
        )
    })

    describe('getUserToken', () => {
        it('should return a token and user ID', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    token_type: 'Bearer',
                    access_token: 'mock_access_token',
                    user_id: 1234,
                }),
            })

            const result = await mercadoPagoUseCase.getUserToken()

            expect(result).toEqual({
                token: 'Bearer mock_access_token',
                userId: 1234,
            })
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/oauth/token'),
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
            )
        })

        it('should throw an error if token fetch fails', async () => {
            global.fetch = jest
                .fn()
                .mockRejectedValue(new Error('Token fetch error'))

            await expect(mercadoPagoUseCase.getUserToken()).rejects.toThrow(
                'Failed to fetch Mercado Pago Token'
            )
        })
    })

    describe('generateQRCodeLink', () => {
        it('should generate a QR Code link', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    qr_data: 'mock_qr_data',
                }),
            })

            const result = await mercadoPagoUseCase.generateQRCodeLink(
                mockTokenData,
                mockOrder
            )

            expect(result).toEqual({
                qr_data: 'mock_qr_data',
            })
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/pos/Loja1/qrs'),
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        Authorization: mockTokenData.token,
                        'Content-Type': 'application/json',
                    },
                })
            )
        })

        it('should throw an error if QR Code generation fails', async () => {
            global.fetch = jest
                .fn()
                .mockRejectedValue(new Error('QR Code generation error'))

            await expect(
                mercadoPagoUseCase.generateQRCodeLink(mockTokenData, mockOrder)
            ).rejects.toThrow('Failed to generate QR code link')
        })
    })
})
