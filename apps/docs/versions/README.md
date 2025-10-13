# API Documentation Versioning

This directory contains version-specific API documentation for the ThamRoi Travel API.

## Structure

```
docs/
├── swagger.ts                    # Main swagger setup with versioning support
├── versions/
│   ├── documentationManager.ts  # Documentation version management
│   ├── v1.swagger.ts            # API v1.0 documentation
│   ├── v2.swagger.ts            # API v2.0 template (future)
│   └── README.md                # This file
```

## Documentation Endpoints

### Discovery Endpoints
- `GET /api-docs` - JSON list of available documentation versions
- `GET /api-docs/versions` - HTML page listing all available versions

### Version-Specific Documentation
- `GET /api-docs/latest` - Latest version documentation (Swagger UI)
- `GET /api-docs/v1` - Version 1.0 documentation (Swagger UI)
- `GET /api-docs/v2` - Version 2.0 documentation (Swagger UI) *future*

### Raw Specifications
- `GET /api-docs/v1/swagger.json` - Raw OpenAPI 3.0 spec for v1
- `GET /api-docs/v2/swagger.json` - Raw OpenAPI 3.0 spec for v2 *future*

## Adding New API Versions

1. **Create new swagger file**: Copy `v1.swagger.ts` to `v{X}.swagger.ts`
2. **Update version config**: Add new version to `apiVersion.ts`
3. **Register specification**: Add to `documentationManager.ts`
4. **Implement routes**: Create corresponding route files in `routes/v{X}/`

### Example: Adding v3

```typescript
// 1. Create v3.swagger.ts
import { swaggerSpecV3 } from "./versions/v3.swagger";

// 2. Register in swagger.ts
DocumentationVersionManager.registerVersion("v3", swaggerSpecV3);

// 3. Update apiVersion.ts
export const API_VERSIONS: Record<string, ApiVersionConfig> = {
  v1: { /* ... */ },
  v2: { /* ... */ },
  v3: {
    version: "3.0.0",
    prefix: "/api/v3", 
    isActive: true,
    description: "Next generation API with GraphQL support"
  }
};
```

## Documentation Features

### Version Management
- **Automatic Discovery**: All active versions are automatically listed
- **Deprecation Support**: Mark versions as deprecated with sunset dates
- **Migration Guides**: Include migration information between versions

### Enhanced UI
- **Custom Styling**: Consistent branding across all versions
- **Persistent Auth**: JWT tokens persist across documentation browsing
- **Version Badges**: Clear indication of active/deprecated status

### Developer Experience
- **Raw JSON Access**: Direct access to OpenAPI specifications
- **Version Comparison**: Easy navigation between API versions
- **Search & Filter**: Enhanced documentation search capabilities

## Best Practices

### Documentation Content
1. **Clear Versioning**: Include version info in titles and descriptions
2. **Migration Guides**: Provide clear upgrade paths between versions
3. **Breaking Changes**: Clearly document breaking changes
4. **Examples**: Include comprehensive request/response examples

### API Design
1. **Backward Compatibility**: Maintain compatibility where possible
2. **Deprecation Strategy**: Give users time to migrate
3. **Version Lifecycle**: Plan version support lifecycle
4. **Feature Flags**: Use feature flags for gradual rollouts

### Maintenance
1. **Regular Updates**: Keep documentation synchronized with implementation
2. **Validation**: Validate OpenAPI specs automatically
3. **Testing**: Test documentation endpoints
4. **Monitoring**: Monitor documentation usage

## Troubleshooting

### Common Issues

**Documentation not loading**
- Check if version is registered in `documentationManager.ts`
- Verify OpenAPI spec syntax with validation tools
- Ensure routes point to correct file paths

**Version not appearing**
- Verify version is marked as `isActive: true` in `apiVersion.ts`
- Check if version spec is properly exported
- Ensure registration happens before server startup

**Swagger UI issues**
- Clear browser cache
- Check browser console for JavaScript errors
- Verify SwaggerUI version compatibility

### Debug Commands

```bash
# Validate OpenAPI spec
npx swagger-codegen validate -i /api-docs/v1/swagger.json

# Test documentation endpoints
curl http://localhost:8080/api-docs
curl http://localhost:8080/api-docs/v1/swagger.json

# Check version registration
node -e "console.log(require('./apps/docs/versions/documentationManager').DocumentationVersionManager.getAvailableVersions())"
```