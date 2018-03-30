import '../../bootstrap';

import {ApiConfigurator, ApiEntityMetadataLoader, Entity, Id} from '../../../src';
import {MockApiConfiguration} from '../../mocks';
import {expect} from 'chai';


let loader: ApiEntityMetadataLoader;
let config: MockApiConfiguration;


describe('#Configuration/ApiConfiguration', () => {

	beforeEach(() => {
		loader = new ApiEntityMetadataLoader;
		config = new MockApiConfiguration(loader);
	});

	describe('initialize()', () => {

		it('should throw an error if url is not configured', () => {
			class Config extends ApiConfigurator
			{

				protected configure(): void {}

			}

			const config = new Config(loader);

			expect(() => {
				config.initialize();
			}).to.throw(Error, 'ApiConfiguration: please, set url.');
		});

		it('should throw an error if configuration is modified after initialization', () => {
			config.initialize();

			expect(() => {
				config.setUrl('localhost');
			}).to.throw(Error, 'ApiConfiguration: can not change configuration after it was initialized.');
		});

	});

	describe('getUrl()', () => {

		it('should return configured url', () => {
			expect(config.getUrl()).to.be.equal(undefined);
			config.setUrl('localhost');
			expect(config.getUrl()).to.be.equal('localhost');
		});

	});

	describe('registerEntity()', () => {

		it('should register and load metadata of a new entity', () => {
			@Entity({
				type: 'user',
			})
			class User
			{

				@Id()
				public id: number;

			}

			config.registerEntity(User);

			expect(config.getMapping('user')).to.be.eql({
				entityType: User,
				type: 'user',
				id: 'id',
				columns: {},
				relationships: {},
			});
		});

	});

});