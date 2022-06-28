import { useQuery } from './hooks'
import axios from 'axios'
import { useHistory } from "react-router"
import { Form, Input, Button, Checkbox, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment'



export default function CreateVote() {
	var query = useQuery()
	var history = useHistory()

	async function createVote(voteInfo) {
		try {
			var vote = (await axios.post('/vote/create', {
				...voteInfo,
				multiSelect: query.has('multiSelect'),
			})).data

			history.push('/vote/' + vote.id)
		} catch (e) {
			alert(e)
		}
	}

	function onFinish(fd) {
		console.log(fd)
	}
	return (
		<Form
			name="basic"
			initialValues={{ remember: true }}
			onFinish={createVote}
		>
			<Form.Item
				label="Title"
				name="title"
				rules={[{ required: true, message: '请输入投票标题' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				label="Description"
				name="desc"
				rules={[{ required: false, message: '请输入投票描述' }]}
			>
				<Input />
			</Form.Item>

			<Form.List
				name="options"
				initialValue={['', '']}
			>
				{(fields, { add, remove }, { errors }) => (
					<>
						{fields.map((field, index) => (
							<Form.Item
								label={index === 0 ? 'Options' : ''}
								required={false}
								key={field.key}
							>
								<Form.Item
									{...field}
									noStyle
								>
									<Input placeholder="option content" style={{ width: '60%' }} />
								</Form.Item>
								{' '}
								{fields.length > 1 ? (
									<MinusCircleOutlined
										className="dynamic-delete-button"
										onClick={() => remove(field.name)}
									/>
								) : null}
							</Form.Item>
						))}
						<Form.Item>
							<Button
								type="dashed"
								onClick={() => add()}
								style={{ width: '60%' }}
								icon={<PlusOutlined />}
							>
								Add Option
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>

			<Form.Item initialValue={moment().add(1, 'days')} label="DeadLine" name="deadline">
				<DatePicker format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm' }} />
			</Form.Item>
			<Form.Item initialValue={false} name="anonymous" valuePropName="checked">
				<Checkbox>Anonymous</Checkbox>
			</Form.Item>
			<Form.Item initialValue={false} name="restricted" valuePropName="checked">
				<Checkbox>Restricted</Checkbox>
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	);

}
