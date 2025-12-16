import { Form, Input } from 'antd';
import type { DataType } from '../types/types';


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: DataType;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {

  return (
    <td {...restProps}>
      {editing ? (
         <Form.Item
            name="symbol"
            label="Symbol"
            style={
              {
                width: 250
              }
            }
            rules={[{ required: true }, { type: 'string', warningOnly: true  }]}
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;