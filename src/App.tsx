import { useState, useEffect, useRef } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  message,
  Input,
  Statistic,
  Typography,
  Popconfirm,
  Space,
  Spin
} from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined
} from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { ColorSideType, IconSideType, DataType, EditDataObj } from './types/types'
import { getAssetsByIdOrSymbol, getLatestBarsBySymbol } from './services/services'
import EditableCell from './components/EditableCell'

export const conditionShowColorSide = (side: string) => {

  let color: ColorSideType = {
    "neutral": "#A9A9A9",
    "up": "#AAFF00",
    "down": "#EE4B2B"
  }

  return color[side as keyof ColorSideType]
}

export const conditionShowIconSide = (side: string) => {
  let icon: IconSideType = {
    "neutral": <></>,
    "up": <ArrowUpOutlined />,
    "down": <ArrowDownOutlined />
  }
  return icon[side as keyof IconSideType]
}

export const conditionSelectSide = (openPrice: number, closePrice: number) => {
  let side = "neutral"
  if (closePrice > openPrice) {
    side = "up"
  }

  if (closePrice < openPrice) {
    side = "down"
  }

  return side
}

export const checkDuplicatedSymbol = (symbol: string, symbolArray: DataType[]) => {
  return symbolArray.filter(ele => ele.symbol === symbol)
}

export const checkReachLimitSymbol = (symbolArray: DataType[]) => {
  return symbolArray.length === 30
}

export const handleDeleteSymbol = (symbol: string, symbolArray: DataType[]) => {
  let tempData = symbolArray
  tempData = tempData.filter(ele => ele.symbol !== symbol)
  return tempData
}

export const handleEditSymbol = (newValue: DataType, symbolArray: DataType[], editSaveObj: EditDataObj) => {

  const newData = [...symbolArray]
  const index = newData.findIndex((item) => editSaveObj?.oldSymbol === item.symbol)
  if (index > -1) {
    // const item = newData[index]
    newData.splice(index, 1, {
      ...newValue,
      ...symbolArray,
    })
    return newData
  }
  return []
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [tableForm] = Form.useForm()
  const socketRef: any = useRef(null)
  const [lastMessage, setLastMessage] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DataType[]>([
    { key: '1', symbol: 'AAPL', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '2', symbol: 'TSLA', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '3', symbol: 'MSFT', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '4', symbol: 'GOOGL', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '5', symbol: 'AMZN', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '6', symbol: 'META', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '7', symbol: 'NVDA', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '8', symbol: 'NFLX', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '9', symbol: 'AMD', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '10', symbol: 'INTC', openPrice: 0, closePrice: 0, updatedAt: '' },

    { key: '11', symbol: 'PLTR', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '12', symbol: 'COIN', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '13', symbol: 'UBER', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '14', symbol: 'LYFT', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '15', symbol: 'SHOP', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '16', symbol: 'BA', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '17', symbol: 'DIS', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '18', symbol: 'NKE', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '19', symbol: 'JPM', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '20', symbol: 'BAC', openPrice: 0, closePrice: 0, updatedAt: '' },

    { key: '21', symbol: 'V', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '22', symbol: 'MA', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '23', symbol: 'XOM', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '24', symbol: 'CVX', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '25', symbol: 'WMT', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '26', symbol: 'T', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '27', symbol: 'KO', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '28', symbol: 'PEP', openPrice: 0, closePrice: 0, updatedAt: '' },
    { key: '29', symbol: 'RTX', openPrice: 0, closePrice: 0, updatedAt: '' },
  ])
  const [editingKey, setEditingKey] = useState('')
  const isEditing = (record: DataType) => record.key === editingKey

  const handleErrorGetLatestBar = (res: string) => {
    const txtArray = res.split(",")
    message.error(txtArray[1])
  }

  const handleSaveSymbol = async (symbol: string, editSaveObj: EditDataObj) => {
    setLoading(true)
    let value: DataType = {
      key: Math.random().toString(),
      symbol: symbol,
      openPrice: 0,
      closePrice: 0,
      updatedAt: ""
    }

    try {

      if (editSaveObj?.formTypeEdit === true && editSaveObj?.oldSymbol === symbol) {
        setEditingKey('')
        return
      }

      if (checkReachLimitSymbol(data) && editSaveObj?.formTypeEdit === false) {
        throw "You now have 30 symbols."
      }

      const checkAssets = await getAssetsByIdOrSymbol(symbol)
      if (checkAssets.code === 40410000) { // "ไม่พบ symbol นี้"
        throw new Error(checkAssets.message)
      }

      if (checkDuplicatedSymbol(symbol, data).length > 0) {
        throw "This symbol is already"
      }

      const res = await getLatestBarsBySymbol(symbol)

      if (res?.message?.split(",")[0] === "code=400") {
        return handleErrorGetLatestBar(res.message)
      }

      const bars = res.bars
      const temp = bars[symbol]
      if (!temp) throw "This symbol not have price info"
      value.openPrice = temp["o"]
      value.closePrice = temp["c"]
      value.updatedAt = temp["t"]
      let tempData: DataType[] = []
      if (editSaveObj?.formTypeEdit === false) {
        tempData = [
          value,
          ...data
        ]

        setData(tempData)
        subScribeData(tempData)
        message.success('Submit success! :' + value?.symbol)
        handleCancel()
        return
      }
      const result = handleEditSymbol(value, data, editSaveObj)
      if (result.length > 0) {
        setData(result)
        subScribeData(result)
        setEditingKey('')
        message.success('Edit success! :' + symbol)
        return
      }
      message.success('Edit failed! :' + symbol)
      return

    } catch (error) {
      message.error('Submit error! :' + error)
    } finally {
      setLoading(false)
    }

  }

  const onFinishFailed = () => {
    message.error('Submit failed!')
  }

  const showModal = () => {
    setIsModalOpen(true)
    form.resetFields()
  }

  const handleOk = () => {
    form.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }


  const fetchInitDataForFirstTime = async () => {
    try {
      const tempData = data.map(ele => ele.symbol)
      const arraySymbol = encodeURI(tempData.join(","))
      const res = await getLatestBarsBySymbol(arraySymbol)
      const bars = res.bars

      for (let i = 0; i < tempData.length; i++) {
        let temp = bars[tempData[i]]
        updatePriceToData(tempData[i], temp["o"], temp["c"], temp["t"])

      }

    } catch (error) {
      console.error(error)
      message.error('Fetch init error! :' + error)
    }
  }


  const subScribeData = (subscribeData: DataType[]) => {

    if (!socketRef.current) return
    const msgObj = {
      action: "subscribe",
      // trades:data.map(ele => ele.symbol),
      bars: subscribeData.map(ele => ele.symbol)
    }
    socketRef.current.send(JSON.stringify(msgObj))
  }

  const updatePriceToData = (symbol: string, openPrice: number, closePrice: number, updatedAt: string) => {
    let tempData: DataType[] = [...data]
    tempData.forEach((ele: DataType) => {
      if (ele.symbol === symbol) {
        ele.openPrice = openPrice
        ele.closePrice = closePrice
        ele.updatedAt = updatedAt
        return ele
      }
    })
    setData(tempData)
  }

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    tableForm.setFieldsValue({ ...record })
    setEditingKey(record.key)
  }

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      editable: true
    },
    {
      title: 'Latest Price',
      dataIndex: 'latestPrice',
      key: 'latestPrice',
      render: (_: string, record: DataType) => {
        let side = conditionSelectSide(record.openPrice, record.closePrice)
        let color = conditionShowColorSide(side)
        let icon = conditionShowIconSide(side)

        return <>
          <Statistic
            title={side}
            value={record.closePrice}
            styles={{ content: { color: color } }}
            prefix={icon}
          />
        </>
      }
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value: string) => {
        return <>{value ? new Date(value).toLocaleString() : "-"}</>
      }
    },
    {
      title: "Open Price",
      dataIndex: 'openPrice',
      key: 'openPrice',
      hidden: true
    },
    {
      title: "Close Price",
      dataIndex: 'closePrice',
      key: 'closePrice',
      hidden: true
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: DataType) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Typography.Link onClick={() => {

              handleSaveSymbol(tableForm.getFieldValue("symbol"), {
                oldSymbol: record.symbol,
                formTypeEdit: true
              })

            }} style={{ marginInlineEnd: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={() => setEditingKey('')}>
              <a>Cancel</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <a onClick={() => {
              const result = handleDeleteSymbol(record.symbol, data)
              setData(result)
              subScribeData(result)
            }}>Delete</a>
          </Space>

        )
      },
    },
  ]
  const mergedColumns: TableProps<DataType>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: 'text',
        dataIndex: col.key,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  useEffect(() => {
    fetchInitDataForFirstTime()
  }, [])

  // useEffect(() => {
  //     subScribeData();
  // }, [data])


  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEB_SOCKET_APCA ?? "")

    socket.onopen = () => {
      console.log('WebSocket connection established')
      if (!socket) return
      const msgObj = {
        action: "auth",
        key: import.meta.env.VITE_APCA_API_KEY ?? "",
        secret: import.meta.env.VITE_APCA_SECRET_KEY
      }
      socket.send(JSON.stringify(msgObj))
    }

    socket.onmessage = (event) => {
      socketRef.current = socket
      try {
        const msg = JSON.parse(event.data)
        if (msg?.[0].msg === "authenticated") {
          subScribeData(data)
        }

        if (msg?.[0]["T"] === "b") { // "b" == bars
          const info = msg          
          setLastMessage((prev: any) => {
            let set = new Set()
            const mergedArray = [...info, ...prev]
            let unionArray = mergedArray.filter((item) => {
                if (!set.has(item["S"])) {
                    set.add(item["S"])
                    return true
                }
                return false
            }, set)
           return unionArray
        })
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      // setConnectionStatus('Error');
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed')
      // setConnectionStatus('Disconnected');
    }

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      console.log('Closing WebSocket connection')
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [])

  useEffect(() => {

   
      if (lastMessage.length > 0) {
        for (let i = 0; i < lastMessage?.length; i++) {
            updatePriceToData(lastMessage[i]["S"], lastMessage[i]["o"], lastMessage[i]["c"], lastMessage[i]["t"])
        }

      }
    

  }, [lastMessage])



  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Button type="primary" id="btn-add" onClick={showModal}>ADD Symbol</Button>
      <Form form={tableForm} component={false}>
        <Table
          components={{
            body: { cell: EditableCell },
          }}

          dataSource={data}
          columns={mergedColumns}
        />
      </Form>

      <Modal
        title="Add Symbol"
        className="add-modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"Submit"}
        loading={loading}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={() => {
            handleSaveSymbol(form.getFieldValue("symbol"), {
              formTypeEdit: false,
              oldSymbol: ""
            })
          }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="symbol"
            label="Symbol"
            rules={[{ required: true }, { type: 'string', warningOnly: true }]}
          >
            <Input placeholder="input symbol here" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default App
