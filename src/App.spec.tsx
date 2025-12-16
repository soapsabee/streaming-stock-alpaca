import { expect, test, describe} from 'vitest'
import { findByText, render, screen, waitFor , within} from '@testing-library/react';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import {
    conditionSelectSide,
    conditionShowColorSide,
    checkDuplicatedSymbol,
    checkReachLimitSymbol,
    handleDeleteSymbol,
    handleEditSymbol
} from './App'
import type { DataType } from './types/types'
import App from './App'
describe('The color of the price changes according to whether the price goes up/down.', () => {
    test('case price up or down', () => {
        expect(conditionSelectSide(100, 200)).toBe("up")
        expect(conditionSelectSide(200, 100)).toBe("down")
        expect(conditionSelectSide(100, 100)).toBe("neutral")
    })

    test('case color is green or red', () => {
        const sideUp = conditionSelectSide(100, 200)
        const sideDown = conditionSelectSide(200, 100)
        const sideNeutral = conditionSelectSide(100, 100)

        expect(conditionShowColorSide(sideUp)).toBe("#AAFF00")
        expect(conditionShowColorSide(sideDown)).toBe("#EE4B2B")
        expect(conditionShowColorSide(sideNeutral)).toBe("#A9A9A9")
    })
})

describe('Add New Symbol, Edit, Delete', () => {
    test('check duplicate symbol', () => {
        const data = [
            {
                key: '1',
                symbol: 'AAPL',
                openPrice: 0,
                closePrice: 0,
                updatedAt: '',
            },
            {
                key: '2',
                symbol: 'TSLA',
                openPrice: 0,
                closePrice: 0,
                updatedAt: '',
            }]
        expect(checkDuplicatedSymbol("TSLA", data)).length.greaterThanOrEqual(1)
        expect(checkDuplicatedSymbol("AMD", data)).length(0)
    })

    test("check reach limit symbol", () => {
        const data = []
        for (let i = 0; i < 30; i++) {
            data.push(
                {
                    key: `${i}`,
                    symbol: 'unknow',
                    openPrice: 0,
                    closePrice: 0,
                    updatedAt: '',
                })
        }
        expect(checkReachLimitSymbol(data)).toBe(true)
        expect(checkReachLimitSymbol([])).toBe(false)
    })

    test("delete symbol", () => {
        const data = [
            {
                key: '1',
                symbol: 'AAPL',
                openPrice: 0,
                closePrice: 0,
                updatedAt: '',
            },
            {
                key: '2',
                symbol: 'TSLA',
                openPrice: 0,
                closePrice: 0,
                updatedAt: '',
            }]

        expect(handleDeleteSymbol("TSLA", data)).length.lessThan(data.length)
    })

    test("edit symbol", async () => {
        const data = [
            {
                key: '1',
                symbol: 'AAPL',
                openPrice: 0,
                closePrice: 0,
                updatedAt: '',
            },
            {
                key: '2',
                symbol: 'TSLA',
                openPrice: 0,
                closePrice: 0,
                updatedAt: '',
            }]
        const symbol = "XRP"
        const oldSymbol = "TSLA"
        const oldSymbolIndex = data.findIndex(ele => ele.symbol === oldSymbol)
        let value: DataType = {
            key: Math.random().toString(),
            symbol: symbol,
            openPrice: 100,
            closePrice: 200,
            updatedAt: ""
        }

        const result = handleEditSymbol(value, data, {
            formTypeEdit: true,
            oldSymbol: oldSymbol
        })

        const checkNewSymbolSetInOldIndex = result[oldSymbolIndex].symbol === symbol;

        expect(checkNewSymbolSetInOldIndex).equal(true)
    })

    test('case add symbol', async () => {
      const page = render(<App />)
      const btnElement = page.container.querySelector("#btn-add")
      expect(btnElement).toBeInTheDocument();
      if(btnElement)
      await userEvent.click(btnElement)
      expect(screen.getByPlaceholderText('input symbol here')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument(); 
      const input = screen.getByPlaceholderText('input symbol here');
      const submitBtn = screen.getByText('Submit');
      await userEvent.type(input, "XRP");
      await userEvent.click(submitBtn);
      await waitFor(() => expect(screen.getAllByRole('row').find((row) => within(row).queryByText("XRP") != null)).toBeInTheDocument(), { timeout: 5000})
    })
})