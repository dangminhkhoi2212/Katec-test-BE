export interface IResponse {
	message: string;
	statusCode: number;
	data?: any;
	error?: any;
}
export const customResponse = (result: IResponse) => {
	const { message, statusCode, data, error } = result;
	return { statusCode, message, data, error };
};
