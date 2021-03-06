import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {of as ObservableOf} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';

import {JsonApiConfiguration} from '../configuration/index';
import {JsonApiNormalizer} from '../normalizer/index';
import {mapData} from '../mapping/index';
import {createUrl} from '../utils/index';


export declare interface JsonApiRequestOptions
{
	includes?: Array<string>,
	parameters?: {[name: string]: string},
	transform?: boolean,
}


@Injectable()
export class JsonApiClient
{


	constructor(
		private $http: HttpClient,
		private $config: JsonApiConfiguration,
		private $normalizer: JsonApiNormalizer,
	) {}


	public get<T = any>(url: string, options: JsonApiRequestOptions = {}): Observable<T>
	{
		return this.transformPipe<T>(
			this.$http.get<T>(this.url(url, options)),
			options.transform,
		);
	}


	public put<T = any>(url: string, body: any|Observable<any>, options: JsonApiRequestOptions = {}): Observable<T>
	{
		return this.bodyToObservable(body).pipe(
			mergeMap((observableBody) => {
				return this.transformPipe<T>(
					this.$http.put<T>(this.url(url, options), observableBody),
					options.transform,
				);
			}),
		);
	}


	public delete<T = any>(url: string, options: JsonApiRequestOptions = {}): Observable<T>
	{
		return this.transformPipe<T>(
			this.$http.delete<T>(this.url(url, options)),
			typeof options.transform === 'undefined' ? false : options.transform,
		);
	}


	public post<T = any>(url: string, body: any, options: JsonApiRequestOptions = {}): Observable<T>
	{
		return this.bodyToObservable(body).pipe(
			mergeMap((observableBody) => {
				return this.transformPipe<T>(
					this.$http.post<T>(this.url(url, options), observableBody),
					options.transform,
				);
			}),
		);
	}


	private transformPipe<T>(req: Observable<Object>, transform: boolean = true): Observable<T>
	{
		if (transform) {
			return req.pipe(
				map((data) => this.$normalizer.normalize(data)),
				map((data) => <any>mapData(this.$config, data)),
			);
		}

		return <any>req;
	}


	private url(url: string, options: JsonApiRequestOptions): string
	{
		const parameters = typeof options.parameters === 'undefined' ? {} : {...options.parameters};

		if (typeof options.includes !== 'undefined' && options.includes.length > 0) {
			parameters['include'] = options.includes.join(',');
		}

		return createUrl(`${this.$config.getUrl()}/${url}`, parameters);
	}


	private bodyToObservable(body: any|Observable<any>): Observable<any>
	{
		if (body instanceof Observable) {
			return body;
		}

		return ObservableOf(body);
	}

}
