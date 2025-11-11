import React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Input, Select, Button, Card, Typography, Space } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const defaultField = { name: '', type: 'String' };

function generateJSON(fields) {
  const result = {};
  fields.forEach((field) => {
    if (!field.name) return;
    if (field.type === 'Nested' && field.fields) {
      result[field.name] = generateJSON(field.fields);
    } else if (field.type === 'String') {
      result[field.name] = 'string';
    } else if (field.type === 'Number') {
      result[field.name] = 0;
    }
  });
  return result;
}

function NestedFieldArray({ nestIndex, control, register, setValue }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${nestIndex}.fields`,
  });

  const type = useWatch({
    control,
    name: `fields.${nestIndex}.type`,
  });

  return type === 'Nested' ? (
    <div style={{ paddingLeft: 24, marginTop: 12 }}>
      {fields.map((item, k) => (
        <Card key={item.id} size="small" style={{ marginBottom: 10 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Input
                {...register(`fields.${nestIndex}.fields.${k}.name`)}
                placeholder="Field name"
              />
              <Select
                defaultValue={item.type || 'String'}
                style={{ width: 150 }}
                onChange={(val) =>
                  setValue(`fields.${nestIndex}.fields.${k}.type`, val)
                }
              >
                <Option value="String">String</Option>
                <Option value="Number">Number</Option>
                <Option value="Nested">Nested</Option>
              </Select>
              <Button danger onClick={() => remove(k)}>
                Delete
              </Button>
            </Space>

            <NestedFieldArray
              nestIndex={`${nestIndex}.fields.${k}`}
              control={control}
              register={register}
              setValue={setValue}
            />
          </Space>
        </Card>
      ))}

      <Button
        type="dashed"
        onClick={() => append(defaultField)}
        style={{ marginTop: 10 }}
      >
        + Add Nested Field
      </Button>
    </div>
  ) : null;
}

export default function SchemaBuilder() {
  const { control, register, setValue, watch } = useForm({
    defaultValues: {
      fields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const watchedFields = watch('fields');

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>🧱 JSON Schema Builder</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {fields.map((item, index) => (
          <Card
            key={item.id}
            title={`Field ${index + 1}`}
            extra={
              <Button danger onClick={() => remove(index)}>
                Delete
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Input
                  {...register(`fields.${index}.name`)}
                  placeholder="Field name"
                />
                <Select
                  defaultValue={item.type || 'String'}
                  style={{ width: 150 }}
                  onChange={(val) =>
                    setValue(`fields.${index}.type`, val)
                  }
                >
                  <Option value="String">String</Option>
                  <Option value="Number">Number</Option>
                  <Option value="Nested">Nested</Option>
                </Select>
              </Space>

              <NestedFieldArray
                nestIndex={index}
                control={control}
                register={register}
                setValue={setValue}
              />
            </Space>
          </Card>
        ))}

        <Button type="dashed" onClick={() => append(defaultField)}>
          + Add Field
        </Button>

        <div style={{ marginTop: 32 }}>
          <Title level={4}>📄 Live JSON Preview</Title>
          <pre
            style={{
              background: '#f7f7f7',
              padding: 16,
              borderRadius: 4,
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            {JSON.stringify(generateJSON(watchedFields || []), null, 2)}
          </pre>
        </div>
      </Space>
    </div>
  );
}
